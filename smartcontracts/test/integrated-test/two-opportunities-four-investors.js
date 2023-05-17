const { expect } = require("chai");
const { ethers } = require("hardhat");

const data = [
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 10000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},

	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 10000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},

	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 1000000000000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},

	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 1,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 180,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 360,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 540,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 720,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 900,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 30,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 60,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
	{
		opportunityName: "opportunity",
		opportunityInfo: "opportunityInfo",
		loanType: 0,
		loanAmount: 100000000,
		loanTenureInDays: 1080,
		loanInterest: 7000000,
		paymentFrequencyInDays: 90,
		collateralDocument: "aadhar",
		capitalLoss: 10000000,
	},
];

const OpportunityStatus = {
	UnderReview: 0,
	Rejected: 1,
	Approved: 2,
	Unsure: 3,
	Collateralized: 4,
	Active: 5,
	Drawndown: 6,
	WriteOff: 7,
	Repaid: 8,
};
const subpool = { JuniorSubpool: 0, SeniorSubpool: 1 };

describe("Two opportunities four investors", function () {
	let dygnifyConfig,
		seniorPool,
		lpToken,
		borrowerContract,
		opportunityOrigination,
		collateralToken,
		opportunityPool,
		investor,
		dygnifyTreasury,
		dygnifyKeeper,
		multiSign,
		usdcToken,
		owner1,
		owner2,
		borrowerUser,
		investorUser,
		investorUser2,
		investorUser3,
		investorUser4,
		underwriter;

	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		admin = accounts[0];
		owner1 = accounts[0];
		owner2 = accounts[1];
		borrowerUser = accounts[2];
		investorUser = accounts[3];
		investorUser2 = accounts[4];
		investorUser3 = accounts[5];
		investorUser4 = accounts[6];
		underwriter = accounts[7];
		// Deploy and initialize DygnifyConfig
		const DygnifyConfig = await ethers.getContractFactory("DygnifyConfig");
		dygnifyConfig = await DygnifyConfig.deploy();
		await dygnifyConfig.deployed();
		await dygnifyConfig.initialize();

		// Deploy UsdcToken
		const UsdcToken = await ethers.getContractFactory("TestUSDCToken");
		usdcToken = await UsdcToken.deploy("10000000000000000000000000000");
		await usdcToken.deployed();

		// Deploy SeniorPool
		const SeniorPool = await ethers.getContractFactory("SeniorPool");
		seniorPool = await SeniorPool.deploy();
		await seniorPool.deployed();

		// Deploy LPToken
		const LPToken = await ethers.getContractFactory("LPToken");
		lpToken = await LPToken.deploy();
		await lpToken.deployed();

		// Deploy Borrower
		const Borrower = await ethers.getContractFactory("Borrower");
		borrowerContract = await Borrower.deploy();
		await borrowerContract.deployed();

		// Deploy OpportunityOrigination
		const OpportunityOrigination = await ethers.getContractFactory(
			"OpportunityOrigination"
		);
		opportunityOrigination = await OpportunityOrigination.deploy();
		await opportunityOrigination.deployed();

		// Deploy CollateralToken
		const CollateralToken = await ethers.getContractFactory("CollateralToken");
		collateralToken = await CollateralToken.deploy();
		await collateralToken.deployed();

		// Deploy OpportunityPool
		const OpportunityPool = await ethers.getContractFactory("OpportunityPool");
		opportunityPool = await OpportunityPool.deploy();
		await opportunityPool.deployed();

		// Deploy Investor
		const Investor = await ethers.getContractFactory("Investor");
		investor = await Investor.deploy();
		await investor.deployed();

		// Deploy DygnifyTreasury
		const DygnifyTreasury = await ethers.getContractFactory("DygnifyTreasury");
		dygnifyTreasury = await DygnifyTreasury.deploy();
		await dygnifyTreasury.deployed();

		// Deploy DygnifyKeeper
		const DygnifyKeeper = await hre.ethers.getContractFactory("DygnifyKeeper");
		dygnifyKeeper = await DygnifyKeeper.deploy();
		await dygnifyKeeper.deployed();

		//Deploy MultiSign
		const MultiSign = await hre.ethers.getContractFactory("MultiSign");
		multiSign = await MultiSign.deploy();
		await multiSign.deployed();

		// Set all the addresses
		await dygnifyConfig.setAddress(1, lpToken.address);
		await dygnifyConfig.setAddress(2, usdcToken.address);
		await dygnifyConfig.setAddress(3, seniorPool.address);
		await dygnifyConfig.setAddress(4, opportunityPool.address);
		await dygnifyConfig.setAddress(5, collateralToken.address);
		await dygnifyConfig.setAddress(6, opportunityOrigination.address);
		await dygnifyConfig.setAddress(7, investor.address);
		await dygnifyConfig.setAddress(8, dygnifyTreasury.address);
		await dygnifyConfig.setAddress(9, dygnifyKeeper.address);
		await dygnifyConfig.setAddress(11, multiSign.address);

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
		await dygnifyConfig.setNumber(6, 100);

		// Initialize contracts
		// Initialize the senior pool
		await seniorPool.initialize(dygnifyConfig.address);
		// Initialize LP token
		await lpToken.initialize(seniorPool.address);
		// Initialize Borrower
		await borrowerContract.initialize(dygnifyConfig.address);
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
		await dygnifyTreasury.initialize(dygnifyConfig.address);
		// Initialize the dygnifyKeeper contract
		await dygnifyKeeper.initialize(dygnifyConfig.address);
		//Initialize the MultiSign Contract
		await multiSign._MultiSign_init([owner1.address, owner2.address], "2");

		// from 10000000000000 send 8000000000000 test usdc to investor and 2000000000000 to underwriter
		await usdcToken.transfer(investorUser.address, "80000000000000000");
		await usdcToken.transfer(investorUser2.address, "80000000000000000");
		await usdcToken.transfer(investorUser3.address, "80000000000000000");
		await usdcToken.transfer(investorUser4.address, "80000000000000000");
		await usdcToken.transfer(underwriter.address, "20000000000000000");

		// Borrower should have some initial balance
		await usdcToken.transfer(borrowerUser.address, "1000000000000000000");
	});

	// Two investors(1,2 in 1st and 3,4 in 2nd) invested in both opportunity
	const twoOpportunityFourInvestor = ({
		opportunityName,
		opportunityInfo,
		loanType,
		loanAmount,
		loanTenureInDays,
		loanInterest,
		paymentFrequencyInDays,
		collateralDocument,
		capitalLoss,
	}) =>
		async function () {
			// Create borrowerContract brofile
			await borrowerContract
				.connect(borrowerUser)
				.updateBorrowerProfile(
					"bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4"
				);
			const borrower = borrowerUser.address;

			// create 1st opportunity
			await opportunityOrigination.connect(borrowerUser).createOpportunity({
				borrower,
				opportunityName,
				opportunityInfo,
				loanType,
				loanAmount,
				loanTenureInDays,
				loanInterest,
				paymentFrequencyInDays,
				collateralDocument,
				capitalLoss,
			});

			// create 2nd opportunity
			await opportunityOrigination.connect(borrowerUser).createOpportunity({
				borrower,
				opportunityName: "Opportunity2",
				opportunityInfo,
				loanType,
				loanAmount,
				loanTenureInDays,
				loanInterest,
				paymentFrequencyInDays,
				collateralDocument: "aadhar2",
				capitalLoss,
			});
			const ID1 = ethers.utils.id("aadhar");
			const ID2 = ethers.utils.id("aadhar2");
			// Assign due diligence expert
			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID1, underwriter.address);
			await opportunityOrigination.connect(underwriter).voteOpportunity(ID1, 2);

			// Assign due diligence expert
			// call assignUnderwriters function
			await opportunityOrigination.assignUnderwriters(ID2, underwriter.address);
			await opportunityOrigination.connect(underwriter).voteOpportunity(ID2, 2);

			let opportunity1 = await opportunityOrigination.opportunityToId(ID1);
			let opportunity2 = await opportunityOrigination.opportunityToId(ID2);
			const poolAddress1 = opportunity1.opportunityPoolAddress;
			const poolAddress2 = opportunity2.opportunityPoolAddress;
			let opportunityPool1 = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress1
			);

			let opportunityPool2 = await ethers.getContractAt(
				"OpportunityPool",
				poolAddress2
			);
			const seniorAmount = ((loanAmount * 0.8) / 2).toString();
			// deposit 20% of AMOUNT into junior Pool
			const amountToJunior = (loanAmount - seniorAmount * 2).toString();

			await usdcToken
				.connect(underwriter)
				.approve(opportunityPool1.address, amountToJunior);
			await opportunityPool1
				.connect(underwriter)
				.deposit(subpool.JuniorSubpool, amountToJunior);
			// deposit 80% of AMOUNT into senior Pool
			await usdcToken
				.connect(investorUser)
				.approve(seniorPool.address, seniorAmount);
			await usdcToken
				.connect(investorUser2)
				.approve(seniorPool.address, seniorAmount);

			await usdcToken
				.connect(underwriter)
				.approve(opportunityPool2.address, amountToJunior);
			await opportunityPool2
				.connect(underwriter)
				.deposit(subpool.JuniorSubpool, amountToJunior);
			// deposit 80% of AMOUNT into senior Pool
			await usdcToken
				.connect(investorUser3)
				.approve(seniorPool.address, seniorAmount);
			await usdcToken
				.connect(investorUser4)
				.approve(seniorPool.address, seniorAmount);

			await seniorPool.connect(investorUser).stake(seniorAmount);
			await seniorPool.connect(investorUser2).stake(seniorAmount);

			await seniorPool.connect(investorUser3).stake(seniorAmount);
			await seniorPool.connect(investorUser4).stake(seniorAmount);

			await seniorPool.approveUSDC(opportunityPool1.address);
			await seniorPool.invest(ID1);

			await seniorPool.approveUSDC(opportunityPool2.address);
			await seniorPool.invest(ID2);

			// Drawdown
			let beforeBalance = await usdcToken.balanceOf(borrowerUser.address);
			await opportunityPool1.connect(borrowerUser).drawdown();
			let afterBalance = await usdcToken.balanceOf(borrowerUser.address);

			// Borrower should receive usdc
			expect(afterBalance.sub(beforeBalance)).to.equal(loanAmount);

			// Drawdown
			beforeBalance = await usdcToken.balanceOf(borrowerUser.address);
			await opportunityPool2.connect(borrowerUser).drawdown();
			afterBalance = await usdcToken.balanceOf(borrowerUser.address);

			// Borrower should receive usdc
			expect(afterBalance.sub(beforeBalance)).to.equal(loanAmount);

			// Opportunity status should marked as drawdown
			opportunity1 = await opportunityOrigination.opportunityToId(ID1);
			expect(opportunity1.opportunityStatus).to.equal(
				OpportunityStatus.Drawndown
			);

			// Opportunity status should marked as drawdown
			opportunity2 = await opportunityOrigination.opportunityToId(ID2);
			expect(opportunity2.opportunityStatus).to.equal(
				OpportunityStatus.Drawndown
			);

			// Approve test usdc
			await usdcToken
				.connect(borrowerUser)
				.approve(opportunityPool1.address, "100000000000000000000");
			let totalRepayments1 = (
				await opportunityPool1.totalRepayments()
			).toNumber();

			// Approve test usdc
			await usdcToken
				.connect(borrowerUser)
				.approve(opportunityPool2.address, "100000000000000000000");
			let totalRepayments2 = (
				await opportunityPool2.totalRepayments()
			).toNumber();

			// Repayment
			for (let i = 0; i < totalRepayments1; i++) {
				await opportunityPool1.connect(borrowerUser).repayment();
			}

			// Repayment
			for (let i = 0; i < totalRepayments2; i++) {
				await opportunityPool2.connect(borrowerUser).repayment();
			}

			// Opportunity status should marked as repaid
			opportunity1 = await opportunityOrigination.opportunityToId(ID1);
			expect(opportunity1.opportunityStatus).to.equal(OpportunityStatus.Repaid);

			// Opportunity status should marked as repaid
			opportunity2 = await opportunityOrigination.opportunityToId(ID2);
			expect(opportunity2.opportunityStatus).to.equal(OpportunityStatus.Repaid);

			// Underwriter withdraw from OpportunityPool
			beforeBalance = await usdcToken.balanceOf(underwriter.address);
			await opportunityPool1.connect(underwriter).withdrawAll(0);
			afterBalance = await usdcToken.balanceOf(underwriter.address);
			expect(afterBalance.sub(beforeBalance)).to.be.above(0);

			// Underwriter withdraw from OpportunityPool
			beforeBalance = await usdcToken.balanceOf(underwriter.address);
			await opportunityPool2.connect(underwriter).withdrawAll(0);
			afterBalance = await usdcToken.balanceOf(underwriter.address);
			expect(afterBalance.sub(beforeBalance)).to.be.above(0);

			function getUSDCAmountFromShares(amount, sharePrice, lpMantissa) {
				const bnAmount = ethers.BigNumber.from(amount);
				const bnSharePrice = ethers.BigNumber.from(sharePrice);
				const bnLpMantissa = ethers.BigNumber.from(lpMantissa);
				return bnAmount.add(bnAmount.mul(bnSharePrice).div(bnLpMantissa));
			}

			function lpMantissa() {
				return Math.pow(10, 6);
			}

			let sharePrice = await seniorPool.sharePrice();
			let investedAmount = seniorAmount;
			let expectedUSDCAmount = getUSDCAmountFromShares(
				investedAmount,
				sharePrice.toString(),
				lpMantissa().toString()
			);

			let [withdrawableAmt] = await seniorPool
				.connect(investorUser)
				.getUserInvestment();
			beforeBalance = await usdcToken.balanceOf(investorUser.address);
			await seniorPool.connect(investorUser).withdrawWithLP(withdrawableAmt);
			afterBalance = await usdcToken.balanceOf(investorUser.address);
			expect(afterBalance.sub(beforeBalance)).to.equal(expectedUSDCAmount);

			sharePrice = await seniorPool.sharePrice();
			investedAmount = seniorAmount;
			expectedUSDCAmount = getUSDCAmountFromShares(
				investedAmount,
				sharePrice.toString(),
				lpMantissa().toString()
			);

			[withdrawableAmt] = await seniorPool
				.connect(investorUser2)
				.getUserInvestment();
			beforeBalance = await usdcToken.balanceOf(investorUser2.address);
			await seniorPool.connect(investorUser2).withdrawWithLP(withdrawableAmt);
			afterBalance = await usdcToken.balanceOf(investorUser2.address);
			expect(afterBalance.sub(beforeBalance)).to.equal(expectedUSDCAmount);

			sharePrice = await seniorPool.sharePrice();
			investedAmount = seniorAmount;
			expectedUSDCAmount = getUSDCAmountFromShares(
				investedAmount,
				sharePrice.toString(),
				lpMantissa().toString()
			);
			[withdrawableAmt] = await seniorPool
				.connect(investorUser3)
				.getUserInvestment();
			beforeBalance = await usdcToken.balanceOf(investorUser3.address);
			await seniorPool.connect(investorUser3).withdrawWithLP(withdrawableAmt);
			afterBalance = await usdcToken.balanceOf(investorUser3.address);
			expect(afterBalance.sub(beforeBalance)).to.equal(expectedUSDCAmount);

			sharePrice = await seniorPool.sharePrice();
			investedAmount = seniorAmount;
			expectedUSDCAmount = getUSDCAmountFromShares(
				investedAmount,
				sharePrice.toString(),
				lpMantissa().toString()
			);
			[withdrawableAmt] = await seniorPool
				.connect(investorUser4)
				.getUserInvestment();
			beforeBalance = await usdcToken.balanceOf(investorUser4.address);
			await seniorPool.connect(investorUser4).withdrawWithLP(withdrawableAmt);
			afterBalance = await usdcToken.balanceOf(investorUser4.address);
			expect(afterBalance.sub(beforeBalance)).to.equal(expectedUSDCAmount);
		};
	for (let i = 0; i < data.length; i++) {
		let type;
		if (data[i].loanType == 1) {
			type = "Term Loan";
		} else {
			type = "Bullet Loan";
		}
		it(
			`${i + 1}. ${type}-${data[i].loanInterest / 1000000}%-${
				data[i].paymentFrequencyInDays
			}D-${data[i].loanTenureInDays / 30}M-${data[i].loanAmount / 1000000}`,
			twoOpportunityFourInvestor({
				opportunityName: data[i].opportunityName,
				opportunityInfo: data[i].opportunityInfo,
				loanType: data[i].loanType,
				loanAmount: data[i].loanAmount,
				loanTenureInDays: data[i].loanTenureInDays,
				loanInterest: data[i].loanInterest,
				paymentFrequencyInDays: data[i].paymentFrequencyInDays,
				collateralDocument: data[i].collateralDocument,
				capitalLoss: data[i].capitalLoss,
			})
		);
	}
});
