require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config()
require('hardhat-deploy');

const privateKey = process.env.PRIVATE_KEY ?? "NO_PRIVATE_KEY";
const infuraApiKey = process.env.INFURA_ID ?? "NO_INFURA_API_KEY";

const chainIds = {
  kovan: 42,
  mainnet: 1,
};

function getChainConfig(network) {
  const url = `https://${network}.infura.io/v3/${infuraApiKey}`;
  return {
    accounts: [`${privateKey}`],
    chainId: chainIds[network],
    url,
  };
}

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    mainnet: {
      url: 'https://rpc.ankr.com/eth',
      accounts: [`${privateKey}`],
      chainId: 1,
    },
    rinkeby: getChainConfig("rinkeby"),
    kovan: getChainConfig("kovan"),
    kovan2: getChainConfig("kovan"),
    rinkeby: getChainConfig("rinkeby"),
    goerli: getChainConfig('goerli'),
  },
  mocha: {
    timeout: 200000
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./scripts/deploy",
    deployments: "./deployments",
  },
  namedAccounts: {
    deployer: 0
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
