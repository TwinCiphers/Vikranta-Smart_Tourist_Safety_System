const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const { touristRegistryContract, web3 } = require('../config/blockchain');
const { uploadToIPFS } = require('../config/ipfs');
const { encrypt } = require('../utils/encryption');
const { generateQRCode } = require('../utils/qrGenerator');
const { generatePVCCard } = require('../utils/pvcCardGenerator');
const { getMasterAccount, signAndSendTransaction } = require('../config/wallet');

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/tourist/register - Register new tourist
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, nationality, passportNumber, dateOfBirth, address } = req.body;

        // Validate required fields
        if (!name || !nationality) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and nationality are required' 
            });
        }
        
        // Get master wallet account for server-side signing
        const masterAccount = await getMasterAccount();

        // Generate short alphanumeric unique ID (configurable length via env SHORT_ID_LENGTH)
        const ID_LENGTH = parseInt(process.env.SHORT_ID_LENGTH, 10) || 10; // default to 10
        const generateShortId = (len = ID_LENGTH) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const bytes = crypto.randomBytes(len);
            let id = '';
            for (let i = 0; i < len; i++) {
                id += chars[bytes[i] % chars.length];
            }
            return id;
        };

        // Generate unique ID
        const uniqueId = generateShortId();

        // Encrypt sensitive data
        const encryptedData = encrypt(JSON.stringify({
            email,
            phone,
            passportNumber,
            dateOfBirth,
            address
        }));

        console.log('Registering tourist:', { uniqueId, name, nationality });
        console.log('Using master wallet for transaction:', masterAccount.address);

        // Register on blockchain using server-side wallet
        // Master wallet signs and sends the transaction
        const tx = touristRegistryContract.methods.registerTourist(
            uniqueId, 
            name, 
            nationality, 
            encryptedData, 
            masterAccount.address // Tourist record is owned by master wallet
        );
        
        const receipt = await signAndSendTransaction(tx);
        console.log('Transaction successful:', receipt.transactionHash);

        // Track this tourist for authority panel
        const authorityRoute = require('./authority');
        if (authorityRoute.trackTourist) {
            authorityRoute.trackTourist({ uniqueId, name, nationality });
        }

        res.json({
            success: true,
            uniqueId,
            transactionHash: receipt.transactionHash,
            walletAddress: masterAccount.address,
            message: 'Tourist registered successfully. Save your unique ID for login.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Registration failed'
        });
    }
});

// POST /api/tourist/upload-document - Upload documents
router.post('/upload-document', upload.single('document'), async (req, res) => {
    try {
        console.log('Upload request received');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.originalname : 'No file');
        
        const { uniqueId, documentType } = req.body;
        const file = req.file;

        if (!file) {
            console.log('No file in request');
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        if (!uniqueId || !documentType) {
            console.log('Missing uniqueId or documentType');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        console.log('Uploading to IPFS...');
        // Upload to IPFS
        const ipfsHash = await uploadToIPFS(file.buffer);
        console.log('IPFS Hash:', ipfsHash);

        console.log('Updating blockchain...');
        // Update blockchain using master wallet
        const masterAccount = await getMasterAccount();
        const tx = touristRegistryContract.methods.uploadDocument(uniqueId, documentType, ipfsHash);
        const receipt = await signAndSendTransaction(tx);

        console.log('Document uploaded successfully:', receipt.transactionHash);

        res.json({
            success: true,
            ipfsHash,
            transactionHash: receipt.transactionHash,
            message: 'Document uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tourist/info/:uniqueId - Get tourist information
router.get('/info/:uniqueId', async (req, res) => {
    try {
        const { uniqueId } = req.params;

        console.log('Fetching tourist info for:', uniqueId);

        // Get data from blockchain using getTouristInfo
        const touristData = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();

        console.log('Tourist data retrieved (raw):', touristData);
        console.log('Data types:', {
            name: typeof touristData[0],
            nationality: typeof touristData[1],
            encryptedDataHash: typeof touristData[2],
            qrCodeHash: typeof touristData[3],
            isVerified: typeof touristData[4],
            registrationDate: typeof touristData[5],
            verificationDate: typeof touristData[6],
            expirationDate: typeof touristData[7],
            isActive: typeof touristData[8]
        });

        // Handle both old and new contract formats
        let data = {
            name: touristData[0] || touristData.name || '',
            nationality: touristData[1] || touristData.nationality || '',
            encryptedDataHash: touristData[2] || touristData.encryptedDataHash || '',
            qrCodeHash: touristData[3] || touristData.qrCodeHash || '',
            isVerified: touristData[4] !== undefined ? touristData[4] : (touristData.isVerified || false),
            registrationDate: touristData[5] ? Number(touristData[5]) : (touristData.registrationDate ? Number(touristData.registrationDate) : 0),
            verificationDate: 0,
            expirationDate: 0,
            isActive: true
        };

        // Add new fields if they exist (new contract format)
        if (touristData[6] !== undefined) {
            data.verificationDate = Number(touristData[6]);
        }
        if (touristData[7] !== undefined) {
            data.expirationDate = Number(touristData[7]);
        }
        if (touristData[8] !== undefined) {
            data.isActive = touristData[8];
        }

        console.log('Processed data:', data);

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tourist/documents/:uniqueId - Get tourist documents
router.get('/documents/:uniqueId', async (req, res) => {
    try {
        const { uniqueId } = req.params;

        console.log('Fetching documents for:', uniqueId);

        // Get documents from blockchain
        const documents = await touristRegistryContract.methods
            .getTouristDocuments(uniqueId)
            .call();

        console.log('Documents retrieved:', documents.length);

        res.json({
            success: true,
            documents: documents.map(doc => ({
                documentType: doc.documentType,
                ipfsHash: doc.ipfsHash,
                uploadDate: Number(doc.uploadDate), // Convert BigInt to Number
                isVerified: doc.isVerified
            }))
        });
    } catch (error) {
        console.error('Fetch documents error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tourist/qrcode/:uniqueId - Generate and get QR code
router.get('/qrcode/:uniqueId', async (req, res) => {
    try {
        const { uniqueId } = req.params;
        
        console.log('Generating QR code for:', uniqueId);
        
        // Get tourist data for QR code with expiration info
        const touristData = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();
        
        const touristInfo = {
            isVerified: touristData[4],
            expirationDate: touristData[7] ? Number(touristData[7]) : 0
        };
        
        // Generate QR code with tourist data
        const qrCodeDataURL = await generateQRCode(uniqueId, touristInfo);
        
        res.json({
            success: true,
            qrCode: qrCodeDataURL
        });
    } catch (error) {
        console.error('QR code generation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tourist/pvc-card/:uniqueId - Download PVC card
router.get('/pvc-card/:uniqueId', async (req, res) => {
    try {
        const { uniqueId } = req.params;
        
        console.log('Generating PVC card for:', uniqueId);
        
        // Get tourist info from blockchain
        const touristData = await touristRegistryContract.methods
            .getTouristInfo(uniqueId)
            .call();
        
        // Check if verified
        if (!touristData[4]) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tourist must be verified before generating PVC card' 
            });
        }
        
        // Prepare card data
        const cardData = {
            uniqueId,
            name: touristData[0],
            nationality: touristData[1],
            qrCodeHash: touristData[3],
            registrationDate: Number(touristData[5]),
            verificationDate: Number(touristData[6]),
            expirationDate: Number(touristData[7])
        };
        
        console.log('Card data:', cardData);
        
        // Generate PVC card
        const pvcCardBuffer = await generatePVCCard(cardData);
        
        console.log('PVC card generated, size:', pvcCardBuffer.length);
        
        // Send as downloadable PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="tourist-card-${uniqueId}.pdf"`,
            'Content-Length': pvcCardBuffer.length
        });
        
        res.send(pvcCardBuffer);
        
    } catch (error) {
        console.error('PVC card generation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/verify/:qrCodeHash - Public endpoint to verify tourist QR code
router.get('/verify/:qrCodeHash', async (req, res) => {
    try {
        const { qrCodeHash } = req.params;
        
        console.log('Verifying QR code hash:', qrCodeHash);
        
        // Get all tourists and find by QR code hash
        const totalTourists = await touristRegistryContract.methods
            .totalTourists()
            .call();
        
        let foundTourist = null;
        
        for (let i = 0; i < Number(totalTourists); i++) {
            const uniqueId = await touristRegistryContract.methods
                .tourists(i)
                .call();
            
            const info = await touristRegistryContract.methods
                .getTouristInfo(uniqueId)
                .call();
            
            // Check if QR code hash matches (info[3] is qrCodeHash)
            if (info[3] === qrCodeHash || uniqueId === qrCodeHash) {
                const now = Math.floor(Date.now() / 1000);
                const expirationDate = Number(info[7]); // info[7] is expirationDate
                const isExpired = expirationDate > 0 && now > expirationDate;
                
                foundTourist = {
                    success: true,
                    verified: true,
                    tourist: {
                        uniqueId: uniqueId,
                        name: info[0],              // name
                        nationality: info[1],        // nationality
                        qrCodeHash: info[3],        // qrCodeHash
                        isVerified: info[4],        // isVerified
                        isActive: info[8],          // isActive
                        registrationDate: Number(info[5]), // registrationDate
                        verificationDate: Number(info[6]), // verificationDate
                        expirationDate: Number(info[7]),   // expirationDate
                        status: isExpired ? 'EXPIRED' : (info[8] ? 'ACTIVE' : 'INACTIVE')
                    },
                    message: isExpired 
                        ? 'Tourist registration has expired' 
                        : (info[8] 
                            ? 'Valid tourist registration' 
                            : 'Tourist registration is inactive'),
                    timestamp: new Date().toISOString()
                };
                break;
            }
        }
        
        if (!foundTourist) {
            return res.status(404).json({
                success: false,
                verified: false,
                message: 'Invalid QR code - Tourist not found',
                timestamp: new Date().toISOString()
            });
        }
        
        res.json(foundTourist);
        
    } catch (error) {
        console.error('QR verification error:', error);
        res.status(500).json({ 
            success: false, 
            verified: false,
            message: 'Error verifying QR code: ' + error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;

