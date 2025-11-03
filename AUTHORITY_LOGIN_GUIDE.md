
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║          FIX: "sender account not recognized" ERROR                  ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝

🔍 CURRENT PROBLEM:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are logged in with:     0xeae889f45cebe052f3e6f9ffb10a80ca9a35c492
But only this is authority:  0x9bBD3535c5582A4b15a529Bb3794688728988D41
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


✅ SOLUTION - FOLLOW THESE EXACT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: COPY THE PRIVATE KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copy this private key (click and select all):

    0x9c87e7efc66c9e8036ad3f89dd73ca9dd6dc1db0d8a8a061ac5e83f781fe2ce4


STEP 2: IMPORT INTO METAMASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open MetaMask browser extension
2. Click the circle icon in top right corner (account menu)
3. Click "Import Account" or "Add account or hardware wallet"
4. Select "Import Account"
5. Make sure "Private Key" is selected
6. Paste the private key from Step 1
7. Click "Import"

✅ You should see the account: 0x9bBD...8D41


STEP 3: VERIFY GANACHE NETWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Make sure MetaMask is connected to Ganache:
- Network name: Ganache (or Localhost)
- RPC URL: http://localhost:8545
- Chain ID: 5777
- Currency: ETH


STEP 4: LOGIN AS AUTHORITY WITH NEW ACCOUNT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to: https://localhost/authority-login.html
2. Click "Connect Wallet"
3. In MetaMask, SELECT THE NEWLY IMPORTED ACCOUNT (0x9bBD...8D41)
4. Approve the connection
5. Enter your authority passphrase
6. Click "Login"

✅ You should see success message


STEP 5: TEST TOURIST REGISTRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to: https://localhost/tourist-auth.html
2. Fill in the registration form
3. Click "Register"

✅ It should work now!


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 IMPORTANT NOTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  ALWAYS use the imported Account 0 (0x9bBD...8D41) for authority login
⚠️  Don't use other MetaMask accounts - they are NOT authorities
⚠️  This private key is ONLY for local Ganache testing
⚠️  NEVER use this key on mainnet or with real funds!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Need help? The account should have ~99.83 ETH balance in Ganache.

