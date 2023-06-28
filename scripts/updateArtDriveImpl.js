const hre = require("hardhat");
const { deployments, ethers } = hre;

async function main() {
  const ProxyAdmin = await hre.ethers.getContractFactory("ProxyAdmin");
  const proxyAdminAddress = (await deployments.get('ProxyAdmin')).address;
  const proxyAdmin = ProxyAdmin.attach(proxyAdminAddress);

  const implAddress = (await deployments.get('ArtDriverImpl')).address;

  const routerAddress = (await deployments.get('ArtDriver')).address;

  await proxyAdmin.upgrade(routerAddress, implAddress);

  console.log("ArtDriver update impl done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
