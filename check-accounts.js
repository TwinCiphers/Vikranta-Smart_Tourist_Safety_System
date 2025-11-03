const { Web3 } = require('web3');
const web3 = new Web3('http://127.0.0.1:9545');

async function checkAccounts() {
    const accounts = await web3.eth.getAccounts();
    console.log('\nGanache Accounts:\n');
    
    for (let i = 0; i < accounts.length; i++) {
        const balance = await web3.eth.getBalance(accounts[i]);
        const balanceEth = web3.utils.fromWei(balance, 'ether');
        console.log(`Account ${i}: ${accounts[i]}`);
        console.log(`Balance: ${balanceEth} ETH\n`);
    }
}

checkAccounts();
