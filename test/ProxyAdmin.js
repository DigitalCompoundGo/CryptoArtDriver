const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProxyAdmin", function () {
  it("deploy", async function () {
    const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
    const proxyAdmin = await ProxyAdmin.deploy();
    await proxyAdmin.deployed();
    proxyAdminAddress = proxyAdmin.address;
    console.log("ProxyAdmin address: ", proxyAdminAddress);

    let owner = await proxyAdmin.owner();
    console.log("owner: ", owner);
  });
});
