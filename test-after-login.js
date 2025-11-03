const axios = require('axios');

async function quickTest() {
    try {
        console.log('🔍 Step 1: Checking parent wallet status...\n');
        
        const statusResponse = await axios.get('https://localhost/api/authority/parent-wallet-status', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('Parent Status:', statusResponse.data);
        
        if (!statusResponse.data.isConnected) {
            console.log('\n❌ Parent wallet not connected!');
            console.log('Please login as authority first at: https://localhost/authority-login.html');
            return;
        }
        
        console.log('\n✅ Parent wallet connected! Testing registration...\n');
        
        const touristData = {
            name: 'Test Tourist',
            nationality: 'India',
            email: 'test@example.com',
            phoneNumber: '+91-1234567890',
            passportNumber: 'T12345678',
            dateOfBirth: '1990-01-01',
            address: '123 Test Street, Mumbai'
        };
        
        console.log('📤 Sending registration request...');
        
        const registerResponse = await axios.post('https://localhost/api/tourist/register', touristData, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('\n✅ REGISTRATION SUCCESSFUL!');
        console.log(JSON.stringify(registerResponse.data, null, 2));
        console.log('\n🎉 Tourist auth page should now work!');
        
    } catch (error) {
        console.error('\n❌ Error:', error.response ? error.response.data : error.message);
    }
}

quickTest();
