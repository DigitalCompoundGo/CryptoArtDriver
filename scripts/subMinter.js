const hre = require("hardhat");
const fs = require('fs');
const { deployments, ethers } = hre;


async function main() {
  const ArtDriverrThesaurus = await hre.ethers.getContractFactory("ArtDriverThesaurus");
  const address = (await deployments.get('Thesaurus')).address;
  const thesaurus = ArtDriverrThesaurus.attach(address);

  await thesaurus.subMinter('0x04D2BEf435ff7Ea1efE2578f439E7ebF5Ea0Fe47')

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
