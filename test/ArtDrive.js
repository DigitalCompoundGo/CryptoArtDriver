const { expect } = require("chai");
const { keccak256 } = require("ethereumjs-util");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const fs = require('fs')
const simData = fs.readFileSync('./simData.json', 'utf-8')
const AbiCoder = ethers.utils.defaultAbiCoder;
const words = JSON.parse(fs.readFileSync(__dirname + '/../words.json', 'utf-8'));
const VERB_TYPE = 1
const ADJ_TYPE = 2
const NOUN_TYPE = 3
describe("ArtDriver", function () {
  it("deploy", async function () {
    const ArtDriverThesaurus = await ethers.getContractFactory("ArtDriverThesaurus")
    let tImpl = await ArtDriverThesaurus.deploy();
    await addWords(tImpl)
    const name = 'Digital Art Driver'
    const symbol = 'DAD'
    const baseURI = 'https://cad-renderer.digitalcompound.org/metadata'
    const price = 0
    const orangeAmount = 50;
    const blueAmount = 450;
    const greyAmount = 4500;
    const defAllowedMintAmount = 1;
    const merkleRoot = await buildMerkleRoot();

    const ArtDriverImpl = await ethers.getContractFactory("ArtDriver");
    let impl = await ArtDriverImpl.deploy(name, symbol, baseURI, tImpl.address, price, orangeAmount, blueAmount, greyAmount, defAllowedMintAmount, merkleRoot);
    await impl.deployed();
    const toAddress = "0x6e10884FD7a640BC181b496C33EB2f3d722376ab"

    const tx0 = await impl.mint(
      toAddress,
      1
    );

    // wait until the transaction is mined
    await tx0.wait();
    let balance = await impl.balanceOf(toAddress);
    expect(balance).to.eq(1);
  });
});


async function buildMerkleRoot() {
  let leaves = await JSON.parse(simData).map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint256"], x)));
  console.log("leaves: ", leaves);
  let tree = new MerkleTree(leaves, keccak256, { sort: true });
  let merkleRoot = tree.getHexRoot();
  console.log("merkleRoot: ", merkleRoot);
  return merkleRoot;
}

async function addWords(thesaurus) {
  await thesaurus.addWords(VERB_TYPE, words.verbs);
  let verbsAmount = await thesaurus.verbsAmount();
  console.log("verbsAmount: ", verbsAmount.toString());

  await thesaurus.addWords(ADJ_TYPE, words.adjs);
  let adjsAmount = await thesaurus.adjsAmount();
  console.log("adjsAmount: ", adjsAmount.toString());

  await thesaurus.addWords(NOUN_TYPE, words.nouns);
  let nounsAmount = await thesaurus.nounsAmount();
  console.log("nounsAmount: ", nounsAmount.toString());
}
