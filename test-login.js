const axios = require('axios');

async function testLogin() {
    try {
        const uniqueId = 'dWHlELd66y'; // From previous registration
        
        console.log('🔍 Testing Tourist Login\n');
        console.log('Unique ID:', uniqueId);
        console.log('Testing endpoint: GET /api/tourist/info/' + uniqueId);
        console.log('');
        
        const response = await axios.get(`https://localhost/api/tourist/info/${uniqueId}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        
        console.log('✅ Response received:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.success && response.data.data && response.data.data.name) {
            console.log('\n✅ LOGIN WOULD SUCCEED!');
            console.log('Tourist Name:', response.data.data.name);
            console.log('Nationality:', response.data.data.nationality);
            console.log('Is Verified:', response.data.data.isVerified);
            console.log('\n🎉 Login feature is working correctly!');
        } else {
            console.log('\n❌ Login would fail - unexpected response format');
        }
        
    } catch (error) {
        console.error('\n❌ Login test failed:', error.response ? error.response.data : error.message);
    }
}

testLogin();
