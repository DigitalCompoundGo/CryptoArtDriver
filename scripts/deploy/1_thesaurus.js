const fs = require('fs');
const words = JSON.parse(fs.readFileSync('words.json', 'utf-8'));

const VERB_TYPE = 1
const ADJ_TYPE = 2
const NOUN_TYPE = 3

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let impl = await deploy('ArtDriverThesaurusImpl', {
    from: deployer,
    contract: 'ArtDriverThesaurus',
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
  });

  const ArtDriverThesaurus = await ethers.getContractFactory("ArtDriverThesaurus")
  const artDriverThesaurus = ArtDriverThesaurus.attach(impl.address)

  const proxyAdminAddress = (await deployments.get('ProxyAdmin')).address;

  const fragment = artDriverThesaurus.interface.getFunction("initialize()");
  const thesaurusProxyData = artDriverThesaurus.interface.encodeFunctionData(fragment, []);

  let thesaurus = await deploy('Thesaurus', {
    from: deployer,
    contract: 'TransparentUpgradeableProxy',
    args: [impl.address, proxyAdminAddress, thesaurusProxyData],
    log: true,
    skipIfAlreadyDeployed: true,
  });

  thesaurus = ArtDriverThesaurus.attach(thesaurus.address)

  let totalWordsAmount = await thesaurus.totalWordsAmount();
  console.log("totalWordsAmount: ", totalWordsAmount.toString());

  if (totalWordsAmount == '0') {
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
};
module.exports.tags = ['ArtDriverThesaurus'];
