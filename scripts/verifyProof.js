const { ethers } = require("hardhat");
const { keccak256 } = require("ethereumjs-util");
const { MerkleTree } = require("merkletreejs");
const fs = require('fs')
const AbiCoder = ethers.utils.defaultAbiCoder;

const simData = fs.readFileSync('./simData.json', 'utf-8')

const artDriverAddress = "";

async function main() {
  const ArtDriver = await hre.ethers.getContractFactory("ArtDriver");
  const artDriver = ArtDriver.attach(artDriverAddress);

  let leaves = JSON.parse(simData).map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint256"], x)));
  let tree = new MerkleTree(leaves, keccak256, { sort: true });
  let merkleRoot = tree.getHexRoot();
  console.log("merkleRoot: ", merkleRoot);

  const address = '0xeEAB0964Ec7D237C8d7DD82786Dd44761eaDa00b';
  const amount = 11
  const leaf = ethers.utils.keccak256(AbiCoder.encode(["address", "uint256"], [address, amount]));
  let proof = tree.getHexProof(leaf);

  let verify = await artDriver.verifyProof(proof, address, amount);
  console.log("verify: ", verify);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
