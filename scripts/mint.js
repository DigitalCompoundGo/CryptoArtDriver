const hre = require("hardhat");

const toAddress = '0xFb9C88214bC0AB089fdC387342eFf3ebE61FC23d'

async function main() {
  const ArtDriverr = await hre.ethers.getContractFactory("ArtDriver");
  const address = (await deployments.get('ArtDriver')).address;
  const artDriver = ArtDriverr.attach(address);

  let data = await artDriver.mint(toAddress, 1);
  await data.wait();

  let balance = await artDriver.balanceOf(toAddress);
  console.log("balance: ", balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
