const { Web3 } = require('web3');
const fs = require('fs');

async function verifyEverything() {
    try {
        console.log('🔍 Complete Verification\n');
        console.log('=' .repeat(70));
        
        const web3 = new Web3('http://localhost:8545');
        const contractJson = JSON.parse(fs.readFileSync('./build/contracts/TouristRegistry.json', 'utf8'));
        const contractAddress = '0x4c83302C0db7E91d0c5a42604E98650cF5e8c59e';
        const contract = new web3.eth.Contract(contractJson.abi, contractAddress);
        
        const parentWallet = '0xeae889f45cebe052f3e6f9ffb10a80ca9a35c492';
        
        console.log('\n1️⃣ CHECKING AUTHORITY STATUS');
        console.log('   Address:', parentWallet);
        
        const isAuthority = await contract.methods.authorities(parentWallet).call();
        console.log('   Is Authority:', isAuthority);
        
        if (!isAuthority) {
            console.log('\n❌ PROBLEM FOUND: Account is NOT an authority on blockchain!');
            console.log('   This is why you get "sender account not recognized"\n');
            
            console.log('🔧 FIXING NOW...');
            const accounts = await web3.eth.getAccounts();
            const adminAccount = accounts[0];
            
            console.log('   Admin account:', adminAccount);
            console.log('   Adding authority...');
            
            const tx = contract.methods.addAuthority(parentWallet);
            const gas = await tx.estimateGas({ from: adminAccount });
            
            const receipt = await tx.send({
                from: adminAccount,
                gas: Math.floor(gas * 1.2)
            });
            
            console.log('   ✅ Added! Transaction:', receipt.transactionHash);
            
            const isNowAuthority = await contract.methods.authorities(parentWallet).call();
            console.log('   ✅ Verified:', isNowAuthority);
        } else {
            console.log('   ✅ Account IS an authority on blockchain');
        }
        
        console.log('\n2️⃣ CHECKING BALANCE');
        const balance = await web3.eth.getBalance(parentWallet);
        console.log('   Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
        
        if (balance === '0') {
            console.log('   ❌ PROBLEM: No ETH balance! Need gas for transactions.');
        } else {
            console.log('   ✅ Has sufficient balance');
        }
        
        console.log('\n3️⃣ TESTING TRANSACTION');
        console.log('   Attempting to estimate gas for registerTourist...');
        
        try {
            const testTx = contract.methods.registerTourist(
                'TEST123',
                'Test User',
                'India',
                'encrypted_data',
                parentWallet
            );
            
            const gasEstimate = await testTx.estimateGas({ from: parentWallet });
            console.log('   ✅ Gas estimation successful:', gasEstimate);
            console.log('   ✅ Transaction would work!\n');
            
            console.log('🎉 EVERYTHING IS CORRECT NOW!');
            console.log('   Try registering a tourist at: https://localhost/tourist-auth.html\n');
            
        } catch (gasError) {
            console.log('   ❌ Gas estimation failed:', gasError.message);
            
            if (gasError.message.includes('sender account not recognized')) {
                console.log('\n   This means the account is still not recognized.');
                console.log('   The issue might be in how the backend is using the account.');
            }
        }
        
        console.log('=' .repeat(70));
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    }
}

verifyEverything();
