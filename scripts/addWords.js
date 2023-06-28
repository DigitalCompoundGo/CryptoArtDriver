const hre = require("hardhat");
const fs = require('fs');
const { deployments, ethers } = hre;

const words = JSON.parse(fs.readFileSync(__dirname + '/../words.json', 'utf-8'));

const VERB_TYPE = 1
const ADJ_TYPE = 2
const NOUN_TYPE = 3

async function main() {
  const ArtDriverrThesaurus = await hre.ethers.getContractFactory("ArtDriverThesaurus");
  const address = (await deployments.get('Thesaurus')).address;
  const thesaurus = ArtDriverrThesaurus.attach(address);

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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
