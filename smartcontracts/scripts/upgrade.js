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

	// We get the contract to upgrade
	const dygnifyConfigAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
	const borrowerAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
	const multisignAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

	const DygnifyConfig = await hre.ethers.getContractFactory("DygnifyConfig");
	const dygnifyConfig = await hre.upgrades.upgradeProxy(
		dygnifyConfigAddress,
		DygnifyConfig
	);

	await dygnifyConfig.deployed();
	console.log("REACT_APP_DYGNIFYCONFIG = ", dygnifyConfig.address);

	// Senior pool deployment
	const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
	const seniorPool = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(3),
		SeniorPool
	);

	await seniorPool.deployed();
	console.log("REACT_APP_SENIORPOOL = ", seniorPool.address);

	// LP token deplyment
	const LPToken = await hre.ethers.getContractFactory("LPToken");
	const lpToken = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(1),
		LPToken
	);

	await lpToken.deployed();
	console.log("REACT_APP_LPTOKEN = ", lpToken.address);

	// Deploy the borrower
	const Borrower = await hre.ethers.getContractFactory("Borrower");
	const borrower = await hre.upgrades.upgradeProxy(borrowerAddress, Borrower);

	await borrower.deployed();
	console.log("REACT_APP_BORROWER = ", borrower.address);

	// Deploy Opportunity origination pool
	const OpportunityOrigination = await hre.ethers.getContractFactory(
		"OpportunityOrigination"
	);
	const opportunityOrigination = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(6),
		OpportunityOrigination
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
	const collateralToken = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(5),
		CollateralToken
	);

	await collateralToken.deployed();
	console.log("REACT_APP_COLLATERAL_TOKEN = ", collateralToken.address);

	// Investor pool deployment
	const Investor = await hre.ethers.getContractFactory("Investor");
	const investor = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(7),
		Investor
	);
	await investor.deployed();
	console.log("REACT_APP_INVESTOR = ", investor.address);

	// DygnifyTreasury
	const DygnifyTreasury = await hre.ethers.getContractFactory(
		"DygnifyTreasury"
	);
	const dygnifyTreasury = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(8),
		DygnifyTreasury
	);

	await dygnifyTreasury.deployed();
	console.log("REACT_APP_DYGNIFYTREASURY = ", dygnifyTreasury.address);

	// DygnifyKeeper
	const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
	const dygnifyKeeper = await hre.upgrades.upgradeProxy(
		await dygnifyConfig.getAddress(9),
		DygnifyKeeper
	);

	await dygnifyKeeper.deployed();
	console.log("REACT_APP_DYGNIFYKEEPER = ", dygnifyKeeper.address);

	//MultiSign
	const MultiSign = await hre.ethers.getContractFactory("MultiSign");
	const multisign = await hre.upgrades.upgradeProxy(
		multisignAddress,
		MultiSign
	);
	await multisign.deployed();
	console.log("REACT_APP_MULTISIGN = ", multisign.address);

	console.log("All contracts upgraded successfully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
