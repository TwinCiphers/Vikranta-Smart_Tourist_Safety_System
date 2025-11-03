require('dotenv').config();
const { Web3 } = require('web3');
const web3 = new Web3();

// Get mnemonic from .env
const mnemonic = process.env.BLOCKCHAIN_MNEMONIC;
console.log('\n🔑 Deriving accounts from mnemonic:\n');
console.log('Mnemonic:', mnemonic);

// Derive account using Web3's HDWallet (if available)
// For Ganache, account 0 is typically the first derived account

// Manually check what account 0 should be
async function deriveFromMnemonic() {
    try {
        // Connect to Ganache to get the actual account addresses
        const ganacheWeb3 = new Web3('http://127.0.0.1:9545');
        const accounts = await ganacheWeb3.eth.getAccounts();
        
        console.log('\n📋 Ganache Account 0:');
        console.log('Address:', accounts[0]);
        
        // We need to use ganache-cli's derivation or extract from Docker
        console.log('\n💡 To get the private key for this account:');
        console.log('1. The mnemonic is:', mnemonic);
        console.log('2. Account 0 address is:', accounts[0]);
        console.log('3. Use this command in the blockchain container:');
        console.log('   docker exec -it blockchain sh -c "cat /app/ganache_keys.txt"');
        console.log('   OR check Ganache startup logs');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

deriveFromMnemonic();
