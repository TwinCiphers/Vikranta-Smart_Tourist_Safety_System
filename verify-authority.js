const axios = require('axios');

async function verifyAuthority() {
    try {
        console.log('🔍 Verifying Authority Login\n');
        
        const statusResponse = await axios.get('https://localhost/api/authority/parent-wallet-status', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('Current Parent Wallet:', statusResponse.data.parentAddress);
        
        const expectedAuthority = '0x9bbd3535c5582a4b15a529bb3794688728988d41';
        const currentAddress = (statusResponse.data.parentAddress || '').toLowerCase();
        
        if (currentAddress === expectedAuthority) {
            console.log('\n✅ CORRECT! You are logged in with the authority account!');
            console.log('✅ Tourist registration should work now!\n');
        } else {
            console.log('\n❌ WRONG ACCOUNT! You are still logged in with:', statusResponse.data.parentAddress);
            console.log('❌ Expected:', '0x9bBD3535c5582A4b15a529Bb3794688728988D41');
            console.log('\n📋 Please follow the steps in AUTHORITY_LOGIN_GUIDE.md\n');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyAuthority();
