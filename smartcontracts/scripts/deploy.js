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
	const dygnifyConfig = await DygnifyConfig.deploy();

	await dygnifyConfig.deployed();
	// Initialize the config
	await dygnifyConfig.initialize();
	console.log("REACT_APP_DYGNIFYCONFIG = ", dygnifyConfig.address);

	// Senior pool deployment
	const SeniorPool = await hre.ethers.getContractFactory("SeniorPool");
	const seniorPool = await SeniorPool.deploy();

	await seniorPool.deployed();
	console.log("REACT_APP_SENIORPOOL = ", seniorPool.address);

	// LP token deplyment
	const LPToken = await hre.ethers.getContractFactory("LPToken");
	const lpToken = await LPToken.deploy();

	await lpToken.deployed();
	console.log("REACT_APP_LPTOKEN = ", lpToken.address);

	// Deploy the borrower
	const Borrower = await hre.ethers.getContractFactory("Borrower");
	const borrower = await Borrower.deploy();

	await borrower.deployed();
	console.log("REACT_APP_BORROWER = ", borrower.address);

	// Deploy Opportunity origination pool
	const OpportunityOrigination = await hre.ethers.getContractFactory(
		"OpportunityOrigination"
	);
	const opportunityOrigination = await OpportunityOrigination.deploy();

	await opportunityOrigination.deployed();
	console.log(
		"REACT_APP_OPPORTUNITY_ORIGINATION_ADDRESS = ",
		opportunityOrigination.address
	);

	// deploy collateral token
	const CollateralToken = await hre.ethers.getContractFactory(
		"CollateralToken"
	);
	const collateralToken = await CollateralToken.deploy();

	await collateralToken.deployed();
	console.log("REACT_APP_COLLATERAL_TOKEN = ", collateralToken.address);

	// Opportunity pool deployment
	const OpportunityPool = await hre.ethers.getContractFactory(
		"OpportunityPool"
	);
	const opportunityPool = await OpportunityPool.deploy();
	await opportunityPool.deployed();
	console.log("REACT_APP_OPPORTUNITY_POOL = ", opportunityPool.address);

	// Investor pool deployment
	const Investor = await hre.ethers.getContractFactory("Investor");
	const investor = await Investor.deploy();
	await investor.deployed();
	console.log("REACT_APP_INVESTOR = ", investor.address);

	// DygnifyTreasury
	const DygnifyTreasury = await hre.ethers.getContractFactory(
		"DygnifyTreasury"
	);
	const dygnifyTreasury = await DygnifyTreasury.deploy();

	await dygnifyTreasury.deployed();
	console.log("REACT_APP_DYGNIFYTREASURY = ", dygnifyTreasury.address);
	
	//MultiSign
	const MultiSign = await hre.ethers.getContractFactory(
		"MultiSign"
		);
		const multisign = await MultiSign.deploy();
		await multisign.deployed();
		console.log("REACT_APP_MULTISIGN = ",multisign.address);
		
		
		// DygnifyKeeper
		const DygnifyKeeper = await hre.ethers.getContractFactory(
			"DygnifyKeeper"
			);
			const dygnifyKeeper = await DygnifyKeeper.deploy();
			
			await dygnifyKeeper.deployed();
			console.log("REACT_APP_DYGNIFYKEEPER = ", dygnifyKeeper.address);
			
			// Initialize the Dygnify config
			// Set all the addresses
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
				console.log("Initial numbers configured successfully");
				
				// Initialize contracts
				// initialize the senior pool
				await seniorPool.initialize(dygnifyConfig.address);
				// Initialize LP token
				await lpToken.initialize(seniorPool.address);
				// Initialize Borrower
				await borrower.initialize(dygnifyConfig.address);
				// Initialize the Opportunity origination pool
				await opportunityOrigination.initialize(dygnifyConfig.address);
				// Initialize the collateral token
				await collateralToken.initialize(
					dygnifyConfig.address,
					opportunityOrigination.address
					);
				// Initialize the investor contract
				await investor.initialize(dygnifyConfig.address);
				// Initialize the dygnifyTreasury contract
				await dygnifyTreasury.initialize(dygnifyConfig.address,multisign.address); 
				//Initialize the MultiSign Contract
				await multisign.initialize(["0x60f94DBa25380610Dc4cBa80eEE249B6F1007E60","0xfBe844eFb7a4E1724cA81BBf305A03890ed0C606","0xa0c582002ef9788D65a0Ca73C4f352a1a0a7B801"],"2")
				// Initialize the dygnifyKeeper contract
				await dygnifyKeeper.initialize(dygnifyConfig.address);
				
				console.log("All contracts initilaized successfully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
	console.error(error);
	process.exit(1);
});
