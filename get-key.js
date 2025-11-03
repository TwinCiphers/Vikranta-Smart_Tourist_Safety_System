const Web3 = require('web3');

// Known mnemonic for Ganache
const mnemonic = 'diesel someone meadow ice fee oppose copper mountain distance law insane duty';

// Hardcoded private key for Account 0 from this mnemonic
// This is deterministic from the mnemonic phrase
const ACCOUNT_0_PRIVATE_KEY = '0x9c87e7efc66c9e8036ad3f89dd73ca9dd6dc1db0d8a8a061ac5e83f781fe2ce4';
const ACCOUNT_0_ADDRESS = '0x9bBD3535c5582A4b15a529Bb3794688728988D41';

console.log('\n' + '='.repeat(70));
console.log('GANACHE ACCOUNT 0 (AUTHORITY ACCOUNT)');
console.log('='.repeat(70));
console.log('\n📍 Address:');
console.log(ACCOUNT_0_ADDRESS);
console.log('\n🔑 Private Key (COPY THIS):');
console.log(ACCOUNT_0_PRIVATE_KEY);
console.log('\n' + '='.repeat(70));
console.log('\n📝 STEPS TO FIX "sender account not recognized" ERROR:\n');
console.log('1. Open MetaMask extension');
console.log('2. Click on the account icon (top right)');
console.log('3. Click "Import Account"');
console.log('4. Select "Private Key"');
console.log('5. Paste this private key: ' + ACCOUNT_0_PRIVATE_KEY);
console.log('6. Make sure you are on Ganache network (localhost:8545)');
console.log('7. Go to https://localhost/authority-login.html');
console.log('8. Connect with the newly imported account');
console.log('9. Enter authority passphrase and login');
console.log('10. Now tourist registration will work!\n');
console.log('='.repeat(70) + '\n');
