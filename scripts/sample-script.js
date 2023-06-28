const hre = require("hardhat");

async function main() {
  const ArtDriverr = await hre.ethers.getContractFactory("ArtDriver");
  const address = (await deployments.get('ArtDriver')).address;
  const artDriver = ArtDriverr.attach(address);

  let data =await artDriver.tokenURI(0);
  console.log(data);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
