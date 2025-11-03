const axios = require('axios');

async function checkParentStatus() {
    try {
        console.log('🔍 Checking parent wallet status...\n');
        
        const response = await axios.get('https://localhost/api/authority/parent-wallet-status', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('✅ Response received:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.isConnected) {
            console.log('\n✅ Parent wallet IS CONNECTED');
            console.log(`   Address: ${response.data.parentAddress}`);
        } else {
            console.log('\n❌ Parent wallet NOT CONNECTED');
            console.log('\n📋 ACTION REQUIRED:');
            console.log('   1. Open: https://localhost/authority-login.html');
            console.log('   2. Connect MetaMask');
            console.log('   3. Login with authority passphrase');
            console.log('   4. This will activate the parent wallet');
        }
        
    } catch (error) {
        console.error('❌ Error checking parent status:');
        console.error(`   ${error.message}`);
        if (error.response) {
            console.error('   Server response:', error.response.data);
        }
    }
}

checkParentStatus();
