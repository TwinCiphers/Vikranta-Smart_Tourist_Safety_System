const express = require('express');
const router = express.Router();
const { touristRegistryContract, web3 } = require('../config/blockchain');
const { generateQRCode } = require('../utils/qrGenerator');
const { generatePVCCard } = require('../utils/pvcCardGenerator');
const expirationChecker = require('../services/expirationChecker');
const { generateToken, authenticateJWT, requireRole } = require('../middleware/auth');
const { trackFailedAttempt, resetAttempts, getRemainingAttempts, checkBan } = require('../middleware/bruteForceProtection');
const logger = require('../middleware/securityLogger');
const { setParentWallet, getMasterAccount, signAndSendTransaction } = require('../config/wallet');

// Simple in-memory storage for registered tourists (in production, use a database)
let registeredTourists = [];

// Helper function to track registered tourists
router.trackTourist = (touristData) => {
    const existing = registeredTourists.find(t => t.uniqueId === touristData.uniqueId);
    if (!existing) {
        registeredTourists.push(touristData);
    }
};

// POST /api/authority/login - Authority login with JWT token generation
router.post('/login', checkBan, async (req, res) => {
    try {
        const { address, passphrase } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;
        
        const AUTHORITY_PASSPHRASE = 'vikrantaTBS$2025';
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Wallet address is required'
            });
        }
        
        if (!passphrase) {
            return res.status(400).json({
                success: false,
                message: 'Passphrase is required'
            });
        }
        
        console.log('Authority login attempt:', address);
        logger.authSuccess(address, clientIP, { action: 'login_attempt' });
        
        // Check passphrase first
        if (passphrase !== AUTHORITY_PASSPHRASE) {
            // Track failed attempt
            const banned = trackFailedAttempt(clientIP);
            const remaining = getRemainingAttempts(clientIP);
            
            logger.authFailure('invalid_passphrase', clientIP, {
                address,
                remainingAttempts: remaining,
                banned
            });
            
            return res.status(401).json({
                success: false,
                message: 'Invalid passphrase. Access denied.',
                remainingAttempts: remaining,
                banned
            });
        }
        
        // Check on blockchain if address is an authority
        let isAuthority = await touristRegistryContract.methods
            .authorities(address)
            .call();
        
        console.log('Is authority:', isAuthority);
        
        // If not an authority, automatically add them using the admin account
        if (!isAuthority) {
            console.log('⚠️ Account not an authority. Auto-adding...');
            
            try {
                // Get admin account (Account 0 from Ganache)
                const accounts = await web3.eth.getAccounts();
                const adminAccount = accounts[0]; // Account 0 is the admin/deployer
                
                console.log('Admin account:', adminAccount);
                console.log('Adding authority:', address);
                
                // Add the authority using admin account
                const addAuthorityTx = touristRegistryContract.methods.addAuthority(address);
                const gas = await addAuthorityTx.estimateGas({ from: adminAccount });
                
                // Convert BigInt to Number before calculation
                const gasLimit = Math.floor(Number(gas) * 1.2);
                
                await addAuthorityTx.send({
                    from: adminAccount,
                    gas: gasLimit
                });
                
                console.log('✅ Successfully added as authority!');
                
                // Verify it was added
                isAuthority = await touristRegistryContract.methods
                    .authorities(address)
                    .call();
                
                if (!isAuthority) {
                    throw new Error('Failed to add authority');
                }
                
                logger.authSuccess(address, clientIP, { 
                    action: 'auto_added_authority',
                    addedBy: adminAccount 
                });
                
            } catch (autoAddError) {
                console.error('❌ Failed to auto-add authority:', autoAddError);
                
                // Track failed attempt
                const banned = trackFailedAttempt(clientIP);
                const remaining = getRemainingAttempts(clientIP);
                
                logger.authFailure('not_authority_auto_add_failed', clientIP, {
                    address,
                    error: autoAddError.message,
                    remainingAttempts: remaining,
                    banned
                });
                
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized and failed to add as authority. Please contact admin.',
                    error: autoAddError.message,
                    remainingAttempts: remaining,
                    banned
                });
            }
        }
        
        // Set this authority as the parent wallet (all child operations will use this)
        setParentWallet(address);
        
        // Generate JWT token
        const token = generateToken(address, 'authority', '24h');
        
        // Reset failed attempts on successful login
        resetAttempts(clientIP);
        
        logger.authSuccess(address, clientIP, {
            action: 'login_success',
            tokenGenerated: true,
            parentWalletSet: true
        });
        
        res.json({
            success: true,
            isAuthority: true,
            message: 'Authority verified and logged in. You are now the parent wallet for all operations.',
            token,
            expiresIn: '24h',
            user: {
                address,
                role: 'authority',
                isParentWallet: true
            }
        });
        
    } catch (error) {
        console.error('Authority login error:', error);
        logger.authFailure('login_error', req.ip, {
            error: error.message
        });
        
        res.status(500).json({
            success: false,
            message: 'Login failed: ' + error.message
        });
    }
});

// GET /api/authority/parent-wallet-status - Check parent wallet connection status
router.get('/parent-wallet-status', async (req, res) => {
    try {
        const { getParentWallet, isParentConnected } = require('../config/wallet');
        const parentWallet = getParentWallet();
        
        res.json({
            success: true,
            isConnected: isParentConnected(),
            parentAddress: parentWallet.address,
            message: isParentConnected() 
                ? 'Parent wallet connected' 
                : 'No parent wallet connected. Authority must login with MetaMask.'
        });
    } catch (error) {
        console.error('Parent wallet status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /api/authority/check-authority - Check if address is an authority (PROTECTED)
router.post('/check-authority', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        const { address } = req.body;
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Address is required'
            });
        }
        
        console.log('Checking authority status for:', address);
        logger.dataAccess(req.user.userId, 'authority', 'check_authority', { address });
        
        // Check on blockchain if address is an authority
        const isAuthority = await touristRegistryContract.methods
            .authorities(address)
            .call();
        
        console.log('Is authority:', isAuthority);
        
        res.json({
            success: true,
            isAuthority,
            message: isAuthority ? 'Authority verified' : 'Not an authority'
        });
        
    } catch (error) {
        console.error('Check authority error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// GET /api/authority/pending - Get pending verifications (PROTECTED)
router.get('/pending', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        console.log('Fetching pending verifications...');
        logger.dataAccess(req.user.userId, 'authority', 'get_pending', {});
        
        // Get total tourists from contract
        const totalTourists = await touristRegistryContract.methods.totalTourists().call();
        console.log('Total tourists registered:', totalTourists);
        
        const pending = [];
        
        // If we have tracked tourists, check them first
        for (const tourist of registeredTourists) {
            try {
                const info = await touristRegistryContract.methods
                    .getTouristInfo(tourist.uniqueId)
                    .call();
                
                // Check if not verified AND still active (not rejected)
                if (!info[4] && info[8]) { // isVerified is false AND isActive is true
                    const docs = await touristRegistryContract.methods
                        .getTouristDocuments(tourist.uniqueId)
                        .call();
                    
                    pending.push({
                        uniqueId: tourist.uniqueId,
                        name: info[0],              // name
                        nationality: info[1],        // nationality
                        registrationDate: Number(info[5]), // registrationDate
                        documentCount: docs.length
                    });
                }
            } catch (err) {
                console.error('Error fetching tourist:', err);
            }
        }
        
        console.log('Pending verifications found:', pending.length);

        res.json({
            success: true,
            tourists: pending,
            total: Number(totalTourists)
        });
    } catch (error) {
        console.error('Fetch pending error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/authority/verify - Verify tourist
router.post('/verify', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        const { uniqueId, approved, validityDays = 365, rejectionReason = 'Not specified' } = req.body;
        
        console.log('Verifying tourist:', uniqueId, 'Approved:', approved, 'Validity:', validityDays, 'days');
        logger.dataModification(req.user.userId, 'tourist', 'verify', { uniqueId, approved, validityDays });

        if (!approved) {
            // Handle rejection - mark as inactive on blockchain
            const masterAccount = await getMasterAccount();
            
            try {
                // Call rejectTourist on blockchain using master wallet
                const tx = touristRegistryContract.methods.rejectTourist(uniqueId);
                const receipt = await signAndSendTransaction(tx);
                
                console.log('Tourist rejected on blockchain:', receipt.transactionHash);
                
                // Also remove from in-memory array
                const index = registeredTourists.findIndex(t => t.uniqueId === uniqueId);
                if (index !== -1) {
                    registeredTourists.splice(index, 1);
                    console.log('Tourist removed from registered list:', uniqueId);
                }
                
                // Track rejection with timestamp
                const rejectionData = {
                    uniqueId,
                    rejectionReason,
                    rejectedBy: req.user.userId,
                    rejectionDate: new Date().toISOString(),
                    transactionHash: receipt.transactionHash
                };
                
                console.log('Tourist registration rejected:', rejectionData);
                
                return res.json({
                    success: true,
                    message: 'Tourist registration rejected and marked as inactive on blockchain',
                    rejection: rejectionData
                });
            } catch (error) {
                console.error('Error rejecting tourist on blockchain:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to reject tourist: ' + error.message
                });
            }
        }

        // Validate validity days
        if (validityDays < 1 || validityDays > 3650) {
            return res.status(400).json({
                success: false,
                message: 'Validity must be between 1 and 3650 days'
            });
        }

        // Fetch tourist info before verification to include in QR code
        const touristInfo = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();

        // Instead of storing the full QR code data URL, store a simple hash/reference
        // Since the QR code contains the uniqueId, we can regenerate it anytime
        const qrReference = `QR_${uniqueId.substring(0, 8)}`;
        
        console.log('Using QR reference:', qrReference);

        // Verify on blockchain using master wallet
        const masterAccount = await getMasterAccount();
        const tx = touristRegistryContract.methods.verifyTourist(uniqueId, qrReference, validityDays);
        const receipt = await signAndSendTransaction(tx);

        console.log('Tourist verified on blockchain:', receipt.transactionHash);
        
        // Calculate expiration date timestamp
        const expirationTimestamp = Math.floor(Date.now() / 1000) + (validityDays * 24 * 60 * 60);
        
        // Prepare tourist data for QR code generation with complete information
        const touristDataForQR = {
            name: touristInfo[0],           // name
            nationality: touristInfo[1],     // nationality
            qrCodeHash: qrReference,         // use the new qrReference
            verificationDate: Math.floor(Date.now() / 1000),
            expirationDate: expirationTimestamp,
            isVerified: true
        };
        
        // Generate QR code with complete tourist data
        const qrCodeDataURL = await generateQRCode(uniqueId, touristDataForQR);
        console.log('QR Code generated with tourist data');
        
        // Track this tourist for automatic expiration checking
        expirationChecker.trackTourist(uniqueId);
        console.log('Tourist added to expiration tracker:', uniqueId);
        
        // Calculate expiration date
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + validityDays);

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            qrCode: qrCodeDataURL,
            validityDays: validityDays,
            expirationDate: expirationDate.toISOString(),
            message: `Tourist approved and verified successfully. Valid for ${validityDays} days until ${expirationDate.toLocaleDateString()}`
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/authority/generate-pvc-card - Generate PVC card
router.post('/generate-pvc-card', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        const { uniqueId } = req.body;
        
        console.log('Generating PVC card for:', uniqueId);
        logger.dataAccess(req.user.userId, 'tourist', 'generate_pvc', { uniqueId });

        // Fetch tourist data from blockchain
        const touristInfo = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();
        
        // Extract tourist data
        const touristData = {
            uniqueId: uniqueId,
            name: touristInfo[0],              // name
            nationality: touristInfo[1],        // nationality
            qrCodeHash: touristInfo[3],         // qrCodeHash
            verificationDate: Number(touristInfo[6]), // verificationDate
            expirationDate: Number(touristInfo[7]),   // expirationDate
            isVerified: touristInfo[4]          // isVerified
        };
        
        console.log('Tourist data for PVC card:', touristData);

        // Generate PVC card with complete data
        const pvcCardBuffer = await generatePVCCard(touristData);

        // Send as downloadable file
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="tourist-card-${uniqueId}.pdf"`
        });
        res.send(pvcCardBuffer);
    } catch (error) {
        console.error('PVC card generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/authority/all-tourists - Get all registered tourists
router.get('/all-tourists', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        logger.dataAccess(req.user.userId, 'tourist', 'get_all', {});
        const tourists = await touristRegistryContract.methods
            .getAllTourists()
            .call();

        res.json({
            success: true,
            data: tourists
        });
    } catch (error) {
        console.error('Fetch all tourists error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/authority/check/:uniqueId - Check a specific tourist by ID (PROTECTED)
router.get('/check/:uniqueId', authenticateJWT, requireRole('authority'), async (req, res) => {
    try {
        const { uniqueId } = req.params;
        
        console.log('Checking tourist:', uniqueId);
        logger.dataAccess(req.user.userId, 'tourist', 'check_by_id', { uniqueId });
        
        const info = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();
        
        const docs = await touristRegistryContract.methods
            .getTouristDocuments(uniqueId)
            .call();
        
        // Add to tracking if not verified
        if (!info[4]) {
            const existing = registeredTourists.find(t => t.uniqueId === uniqueId);
            if (!existing) {
                registeredTourists.push({
                    uniqueId,
                    name: info[0],
                    nationality: info[1]
                });
            }
        }
        
        res.json({
            success: true,
            tourist: {
                uniqueId,
                name: info[0],
                nationality: info[1],
                isVerified: info[4],
                registrationDate: Number(info[5]),
                documentCount: docs.length
            }
        });
    } catch (error) {
        console.error('Check tourist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
