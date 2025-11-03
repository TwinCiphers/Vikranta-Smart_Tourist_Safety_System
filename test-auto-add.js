const axios = require('axios');

async function testAutoAddAuthority() {
    try {
        console.log('🧪 Testing Auto-Add Authority Feature\n');
        console.log('=' .repeat(70));
        
        // Test data - your current MetaMask account
        const testAddress = '0xeae889f45cebe052f3e6f9ffb10a80ca9a35c492';
        const passphrase = 'vikrantaTBS$2025';
        
        console.log('\n📋 Test Details:');
        console.log('   Address:', testAddress);
        console.log('   Passphrase: [HIDDEN]');
        
        console.log('\n🔄 Attempting login (this will auto-add as authority)...\n');
        
        const response = await axios.post('https://localhost/api/authority/login', {
            address: testAddress,
            passphrase: passphrase
        }, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('✅ SUCCESS! Login response:');
        console.log(JSON.stringify(response.data, null, 2));
        
        console.log('\n🔍 Verifying parent wallet status...');
        
        const statusResponse = await axios.get('https://localhost/api/authority/parent-wallet-status', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('Parent Wallet Status:', JSON.stringify(statusResponse.data, null, 2));
        
        if (statusResponse.data.isConnected && 
            statusResponse.data.parentAddress.toLowerCase() === testAddress.toLowerCase()) {
            console.log('\n🎉 PERFECT! Everything is working!');
            console.log('✅ Account was auto-added as authority');
            console.log('✅ Parent wallet is connected');
            console.log('✅ Tourist registration should work now!');
            console.log('\n📍 Next Step: Go to https://localhost/tourist-auth.html and register a tourist\n');
        } else {
            console.log('\n⚠️ Parent wallet not set correctly');
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status === 401) {
            console.log('\n💡 The auto-add feature might need adjustment.');
            console.log('   Or you need to use the correct passphrase.');
        }
    }
}

testAutoAddAuthority();
