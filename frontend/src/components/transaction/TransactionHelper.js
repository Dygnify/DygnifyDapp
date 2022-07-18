import { ethers } from "ethers";
import dygnifyStaking from "../../artifacts/contracts/protocol/DygnifyStaking.sol/DygnifyStaking.json";
import dygnifyToken from "../../artifacts/contracts/protocol/DygnifyToken.sol/DygnifyToken.json";
import { requestAccount } from "../navbar/NavBarHelper";
import opportunityOrigination from "../../artifacts/contracts/protocol/OpportunityOrigination.sol/OpportunityOrigination.json";



const dygnifyStakingAddress = "0xCF1709F792c209Bf8fF1294aD9deaF0dfE44e9F6";
const token = "0x9C80225f50E1be2fa8b1f612616d03Bc9a491107";
const opportunityOriginationAddress = "0x608151Ca57E8Eba14363557dE48D46134B4f7e91";

export async function approve(amount) {
  if (amount <= 0 || amount <= "0") {
    console.log("Amount must be greater than 0");
  } else if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract2 = new ethers.Contract(token, dygnifyToken.abi, signer);
    const transaction = await contract2.approve(dygnifyStakingAddress, amount);
    await transaction.wait();
  }
}

export async function allowance(ownerAddress) {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract2 = new ethers.Contract(token, dygnifyToken.abi, signer);
    const transaction = await contract2.allowance(
      ownerAddress,
      dygnifyStakingAddress
    );

    return ethers.utils.formatEther(transaction);
  }
}

export async function stake(amount) {
  if (amount <= 0 || amount <= "0") {
    console.log("Amount must be greater than 0");
  } else if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      dygnifyStakingAddress,
      dygnifyStaking.abi,
      signer
    );
    const transaction1 = await contract.stake(amount);
    await transaction1.wait();
  }
}

export async function unstake(amount) {
  if (amount === 0) console.log("Amount must be greater than 0");
  else if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      dygnifyStakingAddress,
      dygnifyStaking.abi,
      signer
    );
    const transaction = await contract.unstake(amount);
    await transaction.wait();
  }
}

export async function withdrawYield() {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      dygnifyStakingAddress,
      dygnifyStaking.abi,
      signer
    );
    const transaction = await contract.withdrawYield();
    await transaction.wait();
  }
}

export async function getTotalYield() {
  try {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        dygnifyStakingAddress,
        dygnifyStaking.abi,
        signer
      );
      const data = await contract.getTotalYield();

      return ethers.utils.formatEther(data);
    }
  } catch (error) {
    console.log(error);
  }
  return 0;
}

export async function getWalletBal() {
  try {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // console.log({ provider });
      const contract = new ethers.Contract(token, dygnifyToken.abi, provider);
      const signer = provider.getSigner();
      const bal = await contract.balanceOf(await signer.getAddress());
      // console.log(ethers.utils.formatEther(bal));
      return ethers.utils.formatEther(bal);
      console.log(ethers.utils.formatEther(bal));
    }
  } catch (error) {
    console.log(error);
  }

  return 0;
}

export async function getWithdrawBal() {
  try {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        dygnifyStakingAddress,
        dygnifyStaking.abi,
        provider
      );

      const signer = provider.getSigner();
      const data = await contract.stakingBalance(await signer.getAddress());
      return ethers.utils.formatEther(data);
    }
  } catch (error) {
    console.log(error);
  }

  return 0;
}
export const getEthAddress = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  return await signer.getAddress();
};

// to create opportunity
export async function createOpportunity(formData) {
  let borrower = await getEthAddress();
  let { loan_type, loan_amount, loan_tenure, loan_interest, capital_loss, payment_frequency, loanInfoHash, collateralHash } = formData;
  console.log('backend call', formData)

  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log({ provider });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      opportunityOriginationAddress,
      opportunityOrigination.abi,
      signer
    );
    const transaction1 = await contract.createOpportunity(
      borrower,
      loanInfoHash,
      loan_type,
      loan_amount,
      loan_tenure,
      loan_interest,
      payment_frequency,
      collateralHash,
      capital_loss
    );
    await transaction1.wait();
  }
}


// to fetch created opportunities of specific borrower
export async function getOpportunitysOf() {
  try {
    if (typeof window.ethereum !== "undefined") {
      // await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        opportunityOriginationAddress,
        opportunityOrigination.abi,
        provider
      );

      let borrower = await getEthAddress();
      const data = await contract.getOpportunityOf(borrower);
      let opportunities = [];
      for (let i = 0; i < data.length; i++) {
        let obj = {};
        let tx = await contract.opportunityToId(data[i]);
        obj.borrower = tx.borrower.toString()
        obj.opportunity_id = tx.opportunityID.toString()
        obj.loan_info = tx.opportunityInfo.toString()
        obj.loan_type = tx.loanType.toString()
        obj.loan_amount = tx.loanAmount.toString()
        obj.loan_tenure = tx.loanTenureInDays.toString()
        obj.loan_interest = tx.loanInterest.toString()
        obj.payment_frequency = tx.paymentFrequencyInDays.toString()
        obj.collateral_document = tx.collateralDocument.toString()
        obj.capital_loss = tx.capitalLoss.toString()
        opportunities.push(obj);
      }
      return opportunities;
    }
  } catch (error) {
    console.log(error);
  }

  return 0;
}

// to fetch opportunity by id
export async function getOpportunityAt(id) {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        opportunityOriginationAddress,
        opportunityOrigination.abi,
        provider
      );

      let obj = {};
      console.log('check')
      let tx = await contract.opportunityToId(id);
      console.log(tx)
      obj.borrower = tx.borrower.toString()
      obj.opportunity_id = tx.opportunityID.toString()
      obj.opportunity_info = tx.opportunityInfo.toString()
      obj.loan_type = tx.loanType.toString() // 0 or 1 need to be handled
      obj.loan_amount = tx.loanAmount.toString()
      obj.loan_tenure = tx.loanTenureInDays.toString()
      obj.loan_interest = tx.loanInterest.toString()
      obj.payment_frequency = tx.paymentFrequencyInDays.toString()
      obj.collateral_document = tx.collateralDocument.toString()
      obj.capital_loss = tx.capitalLoss.toString()
      return obj;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}


export async function getAllActiveOpportunities() {
  try {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log({ provider });
      const contract = new ethers.Contract(
        opportunityOriginationAddress,
        opportunityOrigination.abi,
        provider
      );

      const count = await contract.getTotalOpportunities();;
      let opportunities = [];

      for (let i = 0; i < count; i++) {
        let id = await contract.opportunityIds(i);
        let obj = {};
        let tx = await contract.opportunityToId(id);
        if (tx.opportunityStatus.toString() == "5") {
          obj.borrower = tx.borrower.toString()
          obj.opportunity_id = tx.opportunityID.toString()
          obj.opportunity_info = tx.opportunityInfo.toString()
          obj.loan_type = tx.loanType.toString() // 0 or 1 need to be handled
          obj.loan_amount = tx.loanAmount.toString()
          obj.loan_tenure = tx.loanTenureInDays.toString()
          obj.loan_interest = tx.loanInterest.toString()
          obj.payment_frequency = tx.paymentFrequencyInDays.toString()
          obj.collateral_document = tx.collateralDocument.toString()
          obj.capital_loss = tx.capitalLoss.toString()
          opportunities.push(obj);
        }
      }
      return opportunities;
    }
  }
  catch (error) {
    console.log(error);
  }

  return 0;
}
