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

	// deply the config first as this will be used in most of the contracts
	const DygnifyConfig = await hre.ethers.getContractFactory("DygnifyConfig");
	const dygnifyConfig = await hre.upgrades.deployProxy(DygnifyConfig, {
		kind: "uups",
	});

	await dygnifyConfig.deployed();
	console.log("REACT_APP_DYGNIFYCONFIG = ", dygnifyConfig.address);

	// Senior pool deployment
	const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
	const seniorPool = await await hre.upgrades.deployProxy(
		SeniorPool,
		[dygnifyConfig.address],
		{
			kind: "uups",
		}
	);

	await seniorPool.deployed();
	console.log("REACT_APP_SENIORPOOL = ", seniorPool.address);

	// LP token deplyment
	const LPToken = await hre.ethers.getContractFactory("LPToken");
	const lpToken = await hre.upgrades.deployProxy(
		LPToken,
		[seniorPool.address],
		{
			kind: "uups",
		}
	);

	await lpToken.deployed();
	console.log("REACT_APP_LPTOKEN = ", lpToken.address);

	// Deploy the borrower
	const Borrower = await hre.ethers.getContractFactory("Borrower");
	const borrower = await hre.upgrades.deployProxy(
		Borrower,
		[dygnifyConfig.address],
		{
			kind: "uups",
		}
	);

	await borrower.deployed();
	console.log("REACT_APP_BORROWER = ", borrower.address);

	// Deploy Opportunity origination pool
	const OpportunityOrigination = await hre.ethers.getContractFactory(
		"OpportunityOrigination"
	);
	const opportunityOrigination = await hre.upgrades.deployProxy(
		OpportunityOrigination,
		[dygnifyConfig.address],
		{
			kind: "uups",
		}
	);

	await opportunityOrigination.deployed();
	console.log(
		"REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS = ",
		opportunityOrigination.address
	);

	// deploy collateral token
	const CollateralToken = await hre.ethers.getContractFactory(
		"CollateralToken"
	);
	const collateralToken = await hre.upgrades.deployProxy(
		CollateralToken,
		[dygnifyConfig.address, opportunityOrigination.address],
		{
			kind: "uups",
		}
	);

	await collateralToken.deployed();
	console.log("REACT_APP_COLLATERAL_TOKEN = ", collateralToken.address);

	// Opportunity pool deployment
	const OpportunityPool = await hre.ethers.getContractFactory(
		"OpportunityPool"
	);
	// This is deployed at later point of time based on Opportunity details
	const opportunityPool = await OpportunityPool.deploy();
	await opportunityPool.deployed();
	console.log("REACT_APP_OPPORTUNITY_POOL = ", opportunityPool.address);

	// Investor pool deployment
	const Investor = await hre.ethers.getContractFactory("Investor");
	const investor = await hre.upgrades.deployProxy(
		Investor,
		[dygnifyConfig.address],
		{
			kind: "uups",
		}
	);
	await investor.deployed();
	console.log("REACT_APP_INVESTOR = ", investor.address);

	//MultiSign
	const MultiSign = await hre.ethers.getContractFactory("MultiSign");
	const multisign = await hre.upgrades.deployProxy(
		MultiSign,
		[
			[
				"0x23Db9F9731BCFb35CAc11B2e8373ACD14318bDF5",
				"0x647e8dcD7e85cf0f2D04a76091F305Ee9B0C8382",
				"0x91933Cf27340b88f5edad8a435c1FEA98d0258d2",
			],
			"2",
		],
		{
			kind: "uups",
		}
	);
	await multisign.deployed();
	console.log("REACT_APP_MULTISIGN = ", multisign.address);

	// DygnifyTreasury
	const DygnifyTreasury = await hre.ethers.getContractFactory(
		"DygnifyTreasury"
	);
	const dygnifyTreasury = await hre.upgrades.deployProxy(
		DygnifyTreasury,
		[dygnifyConfig.address, multisign.address],
		{
			kind: "uups",
		}
	);

	await dygnifyTreasury.deployed();
	console.log("REACT_APP_DYGNIFYTREASURY = ", dygnifyTreasury.address);

	// DygnifyKeeper
	const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
	const dygnifyKeeper = await hre.upgrades.deployProxy(
		DygnifyKeeper,
		[dygnifyConfig.address],
		{
			kind: "uups",
		}
	);

	await dygnifyKeeper.deployed();
	console.log("REACT_APP_DYGNIFYKEEPER = ", dygnifyKeeper.address);

	console.log("All contracts deployed and initilaized successfully");

	// Initialize the Dygnify config
	// Set all the addresses
	await dygnifyConfig.setAddress(
		0,
		"0x23Db9F9731BCFb35CAc11B2e8373ACD14318bDF5"
	);
	await dygnifyConfig.setAddress(1, lpToken.address);
	await dygnifyConfig.setAddress(
		2,
		"0x7c04fAcB6dFa76DccADd04A2d41841cbeD517cC0"
	);
	await dygnifyConfig.setAddress(3, seniorPool.address);
	await dygnifyConfig.setAddress(4, opportunityPool.address);
	await dygnifyConfig.setAddress(5, collateralToken.address);
	await dygnifyConfig.setAddress(6, opportunityOrigination.address);
	await dygnifyConfig.setAddress(7, investor.address);
	await dygnifyConfig.setAddress(8, dygnifyTreasury.address);
	await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
	console.log("DygnifyConfig configured successfully");

	// Set all numbers
	// leverage ratio
	await dygnifyConfig.setNumber(0, 4);
	// Dygnify Fee
	await dygnifyConfig.setNumber(1, 100000);
	// OverDueFee
	await dygnifyConfig.setNumber(2, 5000000);
	// JuniorSubpoolFee
	await dygnifyConfig.setNumber(3, 200000);
	// second value should be the number of months for senior pool funds lockin for investor
	await dygnifyConfig.setNumber(4, 0);
	// WriteOffDays
	await dygnifyConfig.setNumber(5, 90);
	//AdjustmentOffset
	await dygnifyConfig.setNumber(6, 20);
	console.log("Initial numbers configured successfully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
