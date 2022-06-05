// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DygnifyToken = await hre.ethers.getContractFactory("DygnifyToken");
  const dygnifyToken = await DygnifyToken.deploy(process.env.DGNFY_TOKEN_TOTAL_SUPPLY);
  await dygnifyToken.deployed();
  console.log("Dygnify Token deployed to:", dygnifyToken.address);

  const DygnifyStaking = await hre.ethers.getContractFactory("DygnifyStaking");
  const dygnifyStaking = await DygnifyStaking.deploy(dygnifyToken.address);
  await dygnifyStaking.deployed();
  console.log("Dygnify Staking deployed to:", dygnifyStaking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});