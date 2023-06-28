const { ethers } = require("hardhat");
const { keccak256 } = require("ethereumjs-util");
const { MerkleTree } = require("merkletreejs");
const fs = require('fs')

const simData = fs.readFileSync('./simData.json', 'utf-8')

const AbiCoder = ethers.utils.defaultAbiCoder;

async function main() {
    let leaves = JSON.parse(simData).map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint256"], x)));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let merkleRoot = tree.getHexRoot();
    console.log("merkleRoot: ", merkleRoot);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });