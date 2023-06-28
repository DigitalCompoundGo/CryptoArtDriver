const ethers = require('ethers');
const fs = require('fs')

let accountNumber = 10;

async function create_new_account() {
    let tmpWallet = ethers.Wallet.createRandom();
    return (await tmpWallet.getAddress()).toString()
}

async function main() {
    const FILE_NAME = './simData.json'
    let data = "["

    for (let index = 0; index < accountNumber; index++) {
        let address = await create_new_account();
        let amount = Math.ceil(Math.random() * 100) + 1;
        data += '["' + address + '",' + amount + ']';

        if (index !== accountNumber - 1) {
            data += ','
        }
    }
    data += ']'
    fs.writeFile(FILE_NAME, data, err => { });
    console.log("success");
}
main();