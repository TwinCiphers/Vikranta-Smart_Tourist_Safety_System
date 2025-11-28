/**
 * Quick Fix: Add Authority via Backend API
 * This connects to the blockchain through the running backend
 */

const BACKEND_URL = 'http://localhost:3000';

async function addAuthority() {
    try {
        console.log('🔧 Authority Quick Fix Tool\n');
        console.log('This will add your wallet as an authority through the backend.\n');
        
        // The wallet address you want to add (your MetaMask)
        const authorityAddress = '0xeae889f45cebe052f3e6f9ffb10a80ca9a35c492';
        
        console.log('Target Wallet:', authorityAddress);
        console.log('Passphrase: vikrantaTBS$2025\n');
        
        console.log('Step 1: Checking if backend is running...');
        
        // Check backend health
        const healthCheck = await fetch(`${BACKEND_URL}/health`).catch(e => null);
        
        if (!healthCheck || !healthCheck.ok) {
            console.log('\n❌ Backend is not running!');
            console.log('\nPlease start the backend first:');
            console.log('   cd C:\\Users\\dk-32\\Videos\\blockchain');
            console.log('   npm run dev');
            console.log('\nOr with Docker:');
            console.log('   docker-compose up -d');
            return;
        }
        
        console.log('✅ Backend is running\n');
        
        console.log('Step 2: Attempting auto-login to trigger authority add...');
        
        // Try to login - this will auto-add the authority
        const response = await fetch(`${BACKEND_URL}/api/authority/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: authorityAddress,
                passphrase: 'vikrantaTBS$2025'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('\n✅ SUCCESS! You are now an authority!');
            console.log('\nLogin Details:');
            console.log('   URL: http://localhost/authority-login.html');
            console.log('   Wallet:', authorityAddress);
            console.log('   Passphrase: vikrantaTBS$2025');
            console.log('\nJWT Token:', result.token);
        } else {
            console.log('\n❌ Failed:', result.message);
            
            if (result.error) {
                console.log('\nError Details:', result.error);
            }
            
            console.log('\n📋 Troubleshooting Steps:');
            console.log('1. Make sure Ganache blockchain is running (port 9545)');
            console.log('2. Verify contract is deployed');
            console.log('3. Check .env file has correct CONTRACT_ADDRESS');
            console.log('4. Try running: truffle migrate --reset');
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\n📋 Make sure:');
        console.log('1. Backend is running: npm run dev');
        console.log('2. Blockchain is running: docker-compose up -d blockchain');
        console.log('3. Contracts are deployed: truffle migrate');
    }
}

// Run it
addAuthority();
