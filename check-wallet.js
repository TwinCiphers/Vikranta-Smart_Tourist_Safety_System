require('dotenv').config();
const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:9545');

console.log('\n🔍 Checking Master Wallet Configuration\n');
console.log('From .env file:');
console.log('MASTER_WALLET_ADDRESS:', process.env.MASTER_WALLET_ADDRESS);
console.log('MASTER_WALLET_PRIVATE_KEY:', process.env.MASTER_WALLET_PRIVATE_KEY);

console.log('\n📝 Deriving address from private key:');
const account = web3.eth.accounts.privateKeyToAccount(process.env.MASTER_WALLET_PRIVATE_KEY);
console.log('Derived Address:', account.address);

console.log('\n⚠️  Address Match:', account.address.toLowerCase() === process.env.MASTER_WALLET_ADDRESS.toLowerCase() ? 'YES ✅' : 'NO ❌');

if (account.address.toLowerCase() !== process.env.MASTER_WALLET_ADDRESS.toLowerCase()) {
    console.log('\n🔧 Fix: Update .env file with the correct derived address');
    console.log('   MASTER_WALLET_ADDRESS=' + account.address);
}
