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

  const TestUSDCToken = await hre.ethers.getContractFactory("TestUSDCToken");
  const testUSDCToken = await TestUSDCToken.deploy(
    process.env.DGNFY_TOKEN_TOTAL_SUPPLY
  );

  await testUSDCToken.deployed();

  console.log("TestUSDCToken deployed to:", testUSDCToken.address);
  console.log("Balance : ", await testUSDCToken.totalSupply());

  // const usdtToken = "0x3813e82e6f7098b9583FC0F33a962D02018B6803";
  //const DygnifyStaking = await hre.ethers.getContractFactory("DygnifyStaking");
  //const dygnifyStaking = await DygnifyStaking.deploy(testUSDCToken.address, 10);

  //await dygnifyStaking.deployed();

  //console.log("DygnifyStaking deployed to:", dygnifyStaking.address);

  // deply the config first as this will be used in most of the contracts
  const DygnifyConfig = await hre.ethers.getContractFactory("DygnifyConfig");
  const dygnifyConfig = await DygnifyConfig.deploy();

  await dygnifyConfig.deployed();
  // Initialize the config
  await dygnifyConfig.initialize();
  console.log("DygnifyConfig deployed to:", dygnifyConfig.address);

  // Senior pool deployment
  const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
  const seniorPool = await SeniorPool.deploy();

  await seniorPool.deployed();
  // initialize the senior pool
  // 12 months is the lockin period
  await seniorPool.initialize(dygnifyConfig.address, 12);
  console.log("SeniorPool deployed to:", seniorPool.address);

  // LP token deplyment
  const LPToken = await hre.ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy();

  await lpToken.deployed();
  // Initialize LP token
  await lpToken.initialize(seniorPool.address);
  console.log("LPToken deployed to:", lpToken.address);

  // Deploy the borrower
  const Borrower = await hre.ethers.getContractFactory("Borrower");
  const borrower = await Borrower.deploy();

  await borrower.deployed();
  // Initialize Borrower
  await borrower.initialize(dygnifyConfig.address);
  console.log("Borrower deployed to:", borrower.address);

  // Deploy Opportunity origination pool
  const OpportunityOrigination = await hre.ethers.getContractFactory(
    "OpportunityOrigination"
  );
  const opportunityOrigination = await OpportunityOrigination.deploy();

  await opportunityOrigination.deployed();

  // Initialize the Opportunity origination pool
  await opportunityOrigination.initialize(dygnifyConfig.address);
  console.log(
    "Opportunity Origination deployed to:",
    opportunityOrigination.address
  );

  // deploy collateral token
  const CollateralToken = await hre.ethers.getContractFactory(
    "CollateralToken"
  );
  const collateralToken = await CollateralToken.deploy();

  await collateralToken.deployed();
  // Initialize the collateral token
  await collateralToken.initialize(
    dygnifyConfig.address,
    opportunityOrigination.address
  );
  console.log("collateralToken deployed to:", collateralToken.address);

  // Opportunity pool deployment
  const OpportunityPool = await hre.ethers.getContractFactory(
    "OpportunityPool"
  );
  const opportunityPool = await OpportunityPool.deploy();
  await opportunityPool.deployed();
  console.log("OpportunityPool deployed to:", opportunityPool.address);

  // Initialize the Dygnify config with all the addresses
  await dygnifyConfig.setAddress(1, lpToken.address);
  await dygnifyConfig.setAddress(2, testUSDCToken.address);
  await dygnifyConfig.setAddress(3, seniorPool.address);
  await dygnifyConfig.setAddress(4, opportunityPool.address);
  await dygnifyConfig.setAddress(5, collateralToken.address);
  await dygnifyConfig.setAddress(6, opportunityOrigination.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
