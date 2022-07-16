// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const DygnifyToken = await hre.ethers.getContractFactory("DygnifyToken");
  const dygnifyToken = await DygnifyToken.deploy( process.env.DGNFY_TOKEN_TOTAL_SUPPLY );

  await dygnifyToken.deployed();

  console.log("DygnifyToken deployed to:", dygnifyToken.address);

  // const usdtToken = "0x3813e82e6f7098b9583FC0F33a962D02018B6803";
  const DygnifyStaking = await hre.ethers.getContractFactory("DygnifyStaking");
  const dygnifyStaking = await DygnifyStaking.deploy(dygnifyToken.address,10);

  await dygnifyStaking.deployed();

  console.log("DygnifyStaking deployed to:", dygnifyStaking.address);

  const OpportunityOrigination = await hre.ethers.getContractFactory("OpportunityOrigination");
  const opportunityOrigination = await OpportunityOrigination.deploy();

  await opportunityOrigination.deployed();

  console.log("Opportunity Origination deployed to:", opportunityOrigination.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
