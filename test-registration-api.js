// Test tourist registration through the API
const https = require('https');

// Disable SSL verification for testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const testData = {
    name: 'Test User Registration',
    nationality: 'Test Country',
    email: 'test@example.com',
    phone: '1234567890',
    passportNumber: 'TEST123456',
    dateOfBirth: '1990-01-01',
    address: 'Test Address 123'
};

const postData = JSON.stringify(testData);

const options = {
    hostname: 'localhost',
    port: 443,
    path: '/api/tourist/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
    }
};

console.log('\n🧪 Testing Tourist Registration API\n');
console.log('URL: https://localhost:443/api/tourist/register');
console.log('Data:', JSON.stringify(testData, null, 2));
console.log('\nSending request...\n');

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', data);
        
        try {
            const jsonData = JSON.parse(data);
            console.log('\n✅ Response parsed successfully:');
            console.log(JSON.stringify(jsonData, null, 2));
            
            if (jsonData.success) {
                console.log('\n🎉 Registration Successful!');
                console.log('Unique ID:', jsonData.uniqueId);
                console.log('Transaction Hash:', jsonData.transactionHash);
            } else {
                console.log('\n❌ Registration Failed:', jsonData.message);
            }
        } catch (e) {
            console.log('\n❌ Failed to parse response:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
});

req.write(postData);
req.end();
