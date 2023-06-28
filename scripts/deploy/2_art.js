const { ethers } = require("hardhat");
const { keccak256 } = require("ethereumjs-util");
const { MerkleTree } = require("merkletreejs");
const fs = require('fs')
const simData = fs.readFileSync('./simData.json', 'utf-8')
const AbiCoder = ethers.utils.defaultAbiCoder;

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const name = 'Crypto Art Driver'
    const symbol = 'CAD'
    const baseURI = 'https://cad-renderer.digitalcompound.org/metadata'
    const thesaurusAddress = (await deployments.get('Thesaurus')).address;
    const price = '100000000000000000'
    const orangeAmount = 30;
    const blueAmount = 270;
    const greyAmount = 2700;
    const merkleRoot = await buildMerkleRoot();
    const mintStartTime = '1667700000'

    const args = [name, symbol, baseURI, thesaurusAddress, price, orangeAmount, blueAmount, greyAmount, merkleRoot, mintStartTime];

    let implAddress;
    try {
        implAddress = (await deployments.get('ArtDriverImpl')).address
    } catch (error) {
    }

    let impl = await deploy('ArtDriverImpl', {
        from: deployer,
        contract: 'ArtDriver',
        args: args,
        log: true,
        skipIfAlreadyDeployed: true,
    });

    const proxyAdminAddress = (await deployments.get('ProxyAdmin')).address;
    const ProxyAdmin = await hre.ethers.getContractFactory("ProxyAdmin");
    const proxyAdmin = ProxyAdmin.attach(proxyAdminAddress);

    const artDriverImplAddress = impl.address

    const ArtDriver = await ethers.getContractFactory("ArtDriver")
    const artDriverImp = ArtDriver.attach(artDriverImplAddress)

    const fragment = ArtDriver.interface.getFunction("initialize(string, string, string, address, uint256, uint256, uint256, uint256, bytes32, uint256)");
    const artProxyData = artDriverImp.interface.encodeFunctionData(fragment, args)

    console.log("artProxyData:", artProxyData);

    let artDriver = await deploy('ArtDriver', {
        from: deployer,
        contract: 'MyTransparentUpgradeableProxy',
        args: [artDriverImplAddress, proxyAdminAddress, artProxyData],
        log: true,
        skipIfAlreadyDeployed: true,
    });

    if (implAddress !== impl.address) {
        await proxyAdmin.upgrade(artDriver.address, impl.address);
        console.log("upgrade artDriver impl done");
    }

    const ArtDriverThesaurus = await ethers.getContractFactory("ArtDriverThesaurus")
    const artDriverThesaurus = ArtDriverThesaurus.attach(thesaurusAddress)

    await artDriverThesaurus.addMinter(artDriver.address);

    let minter = await artDriverThesaurus.minters(artDriver.address);
    console.log("add Thesaurus minter: ", minter);
};
module.exports.tags = ['ArtDriverProxy'];

async function buildMerkleRoot() {
    let leaves = await JSON.parse(simData).map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint256"], x)));
    // console.log("leaves: ", leaves);
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let merkleRoot = tree.getHexRoot();
    console.log("merkleRoot: ", merkleRoot);
    return merkleRoot;
}
