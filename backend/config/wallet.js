require('dotenv').config();
const { web3 } = require('./blockchain');

// Server-side wallet configuration
// Authority connects to MetaMask as parent, all child operations use that connection
// Using shared web3 instance from blockchain.js

// Parent wallet configuration (set by authority login)
let PARENT_WALLET = {
    address: null,
    isConnected: false
};

/**
 * Set parent wallet (called when authority logs in with MetaMask)
 * @param {string} address - Authority wallet address from MetaMask
 */
function setParentWallet(address) {
    PARENT_WALLET.address = address;
    PARENT_WALLET.isConnected = true;
    console.log('✅ Parent wallet connected:', address);
}

/**
 * Get parent wallet status
 */
function getParentWallet() {
    return PARENT_WALLET;
}

/**
 * Check if parent wallet is connected
 */
function isParentConnected() {
    return PARENT_WALLET.isConnected && PARENT_WALLET.address !== null;
}

/**
 * Get master wallet account
 * Uses Ganache Account 0 for signing, but requires parent authority to be connected
 */
async function getMasterAccount() {
    // Check if parent (authority) is connected for authorization
    if (!isParentConnected()) {
        console.warn('⚠️  No parent wallet connected. Authority must login with MetaMask.');
        throw new Error('Authority must connect MetaMask wallet first. Please login at /authority-login.html');
    }
    
    // Get Ganache accounts for actual transaction signing
    const accounts = await web3.eth.getAccounts();
    const masterAddress = accounts[0]; // Always use Ganache Account 0 for signing
    
    console.log('Using Ganache Account 0 for transaction:', masterAddress);
    console.log('Authorized by parent wallet:', PARENT_WALLET.address);
    
    return {
        address: masterAddress,
        isParent: false,
        authorizedBy: PARENT_WALLET.address
    };
}

/**
 * Sign and send transaction using master wallet
 * @param {Object} tx - Transaction object
 * @returns {Promise} Transaction receipt
 */
async function signAndSendTransaction(tx) {
    try {
        const account = await getMasterAccount();
        
        // Estimate gas
        const gasEstimate = await tx.estimateGas({ from: account.address });
        
        // Get gas price
        const gasPrice = await web3.eth.getGasPrice();
        
        // Convert BigInt values to numbers for calculation
        const gasEstimateNum = Number(gasEstimate);
        const gasPriceNum = Number(gasPrice);
        
        // Send transaction signed by master wallet
        const receipt = await tx.send({
            from: account.address,
            gas: Math.floor(gasEstimateNum * 1.2), // Add 20% buffer
            gasPrice: gasPriceNum
        });
        
        return receipt;
        
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

/**
 * Check master wallet balance
 */
async function getMasterBalance() {
    const account = await getMasterAccount();
    const balance = await web3.eth.getBalance(account.address);
    return web3.utils.fromWei(balance, 'ether');
}

module.exports = {
    setParentWallet,
    getParentWallet,
    isParentConnected,
    getMasterAccount,
    signAndSendTransaction,
    getMasterBalance
};
