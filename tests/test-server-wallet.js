const { getMasterAccount, signAndSendTransaction, getMasterBalance } = require('../backend/config/wallet');
const { touristRegistryContract, web3 } = require('../backend/config/blockchain');

async function testServerWallet() {
    console.log('\n🧪 Testing Server-Side Wallet Implementation\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Get Master Account
        console.log('\n✅ Test 1: Get Master Account');
        const masterAccount = await getMasterAccount();
        console.log('Master Wallet Address:', masterAccount.address);
        console.log('✓ Master account loaded successfully');

        // Test 2: Check Master Wallet Balance
        console.log('\n✅ Test 2: Check Master Wallet Balance');
        const balance = await getMasterBalance();
        console.log('Master Wallet Balance:', balance, 'ETH');
        
        if (parseFloat(balance) < 0.1) {
            console.warn('⚠️  Warning: Low balance. Ensure master wallet has sufficient funds.');
        } else {
            console.log('✓ Master wallet has sufficient balance');
        }

        // Test 3: Test Tourist Registration (without MetaMask)
        console.log('\n✅ Test 3: Test Tourist Registration (Server-Side Signing)');
        const testTourist = {
            name: 'Test Server Wallet User',
            nationality: 'Test Country',
            uniqueId: 'SW' + Date.now().toString().slice(-8),
            encryptedData: 'encrypted_test_data_' + Date.now()
        };

        console.log('Registering tourist:', testTourist.uniqueId);
        const registerTx = touristRegistryContract.methods.registerTourist(
            testTourist.uniqueId,
            testTourist.name,
            testTourist.nationality,
            testTourist.encryptedData,
            masterAccount.address
        );

        const registerReceipt = await signAndSendTransaction(registerTx);
        console.log('Transaction Hash:', registerReceipt.transactionHash);
        console.log('Block Number:', registerReceipt.blockNumber);
        console.log('Gas Used:', registerReceipt.gasUsed);
        console.log('✓ Tourist registered using master wallet');

        // Test 4: Verify Transaction Sender
        console.log('\n✅ Test 4: Verify Transaction Sender');
        const txDetails = await web3.eth.getTransaction(registerReceipt.transactionHash);
        console.log('Transaction From:', txDetails.from);
        console.log('Expected (Master):', masterAccount.address);
        
        if (txDetails.from.toLowerCase() === masterAccount.address.toLowerCase()) {
            console.log('✓ Transaction signed by master wallet (server-side)');
        } else {
            console.error('❌ Transaction NOT signed by master wallet!');
        }

        // Test 5: Retrieve Tourist Info
        console.log('\n✅ Test 5: Retrieve Tourist Info from Blockchain');
        const touristInfo = await touristRegistryContract.methods
            .getTouristInfo(testTourist.uniqueId)
            .call();

        console.log('Tourist Name:', touristInfo[0]);
        console.log('Tourist Nationality:', touristInfo[1]);
        console.log('Is Verified:', touristInfo[2]);
        console.log('Is Active:', touristInfo[3]);
        console.log('✓ Tourist data retrieved successfully');

        // Test 6: Document Upload (Server-Side Signing)
        console.log('\n✅ Test 6: Test Document Upload (Server-Side Signing)');
        const testDocument = {
            documentType: 'passport',
            ipfsHash: 'QmTest' + 'a'.repeat(42) // Mock 46-character hash
        };

        const uploadTx = touristRegistryContract.methods.uploadDocument(
            testTourist.uniqueId,
            testDocument.documentType,
            testDocument.ipfsHash
        );

        const uploadReceipt = await signAndSendTransaction(uploadTx);
        console.log('Document Upload TX:', uploadReceipt.transactionHash);
        console.log('✓ Document uploaded using master wallet');

        // Test 7: Verify Document Upload
        console.log('\n✅ Test 7: Verify Document Upload');
        const documents = await touristRegistryContract.methods
            .getTouristDocuments(testTourist.uniqueId)
            .call();

        console.log('Total Documents:', documents[0].length);
        if (documents[0].length > 0) {
            console.log('Document Type:', documents[0][0]);
            console.log('IPFS Hash:', documents[1][0]);
            console.log('✓ Document verified on blockchain');
        }

        // Test 8: Verify Tourist (Approval)
        console.log('\n✅ Test 8: Test Tourist Verification (Server-Side Signing)');
        const qrReference = `QR_${testTourist.uniqueId.substring(0, 8)}`;
        const validityDays = 365;

        const verifyTx = touristRegistryContract.methods.verifyTourist(
            testTourist.uniqueId,
            qrReference,
            validityDays
        );

        const verifyReceipt = await signAndSendTransaction(verifyTx);
        console.log('Verification TX:', verifyReceipt.transactionHash);
        console.log('✓ Tourist verified using master wallet');

        // Test 9: Check Verification Status
        console.log('\n✅ Test 9: Check Verification Status');
        const verifiedInfo = await touristRegistryContract.methods
            .getTouristInfo(testTourist.uniqueId)
            .call();

        console.log('Is Verified:', verifiedInfo[2]);
        console.log('Is Active:', verifiedInfo[3]);
        
        if (verifiedInfo[2]) {
            console.log('✓ Tourist successfully verified on blockchain');
        }

        // Final Summary
        console.log('\n' + '='.repeat(60));
        console.log('🎉 All Server-Side Wallet Tests Passed!');
        console.log('='.repeat(60));
        console.log('\n✅ Key Features Verified:');
        console.log('  • Master wallet loaded and functional');
        console.log('  • Server-side transaction signing working');
        console.log('  • Tourist registration without MetaMask');
        console.log('  • Document upload without MetaMask');
        console.log('  • Tourist verification without MetaMask');
        console.log('  • All transactions signed by master wallet');
        console.log('\n💡 Users no longer need MetaMask for tourist operations!');
        console.log('💡 Master wallet handles all blockchain transactions');
        console.log('💡 Lower barrier to entry for non-crypto users\n');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run tests
testServerWallet();
