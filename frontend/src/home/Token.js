import { useState } from 'react';
import { ethers } from 'ethers'
import dygToken from "../artifacts/contracts/DygnifyToken.sol/DygnifyToken.json";
import NFTMinter from "../artifacts/contracts/NFT_minter.sol/NFTMinter.json";
import axiosHttpService from '../services/axioscall';
import { uploadFileToIPFS } from '../services/PinataIPFSOptions';
import { amlCheck } from '../services/OFACAxiosOptions';
import axios from 'axios';

const tokenAddress = "0x1546A8e7389B47d2Cf1bacE7C0ad3e0A91CAae94"
const NFT_minter = "0xbEfC9040e1cA8B224318e4f9BcE9E3e928471D37"

//metadata to ipfs
const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      }
    })
    .then(function (response) {
      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
      };
    })
    .catch(function (error) {
      console.log(error)
      return {
        success: false,
        message: error.message,
      }

    });
};

function Token() {
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [tokenURI, setTokenURI] = useState("");
  const [nameForAMLCheck, setNameForAMLCheck] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, dygToken.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, dygToken.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function approveSendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, dygToken.abi, signer);
      const transaction = await contract.approve(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function mint_NFT(tokenURI) {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFT_minter, NFTMinter.abi, signer);
      const transaction = await contract.mint(tokenURI);
      await transaction.wait();
      console.log(`${tokenURI} has minted sucessfully.`);
      alert(`${tokenURI} has minted sucessfully.`);
    }
  }

  // On file upload (click the upload button)
  async function onFileUpload() {
    try {
      console.log("Upload called");
      let ipfsUploadRes = await axiosHttpService(uploadFileToIPFS(selectedFile));
      console.log(ipfsUploadRes);
      //make metadata
      const metadata = new Object();
      metadata.imageHash = ipfsUploadRes.res.IpfsHash;
      metadata.PinSize = ipfsUploadRes.res.PinSize;
      metadata.Timestamp = ipfsUploadRes.res.Timestamp;

      //make pinata call
      const pinataResponse = await pinJSONToIPFS(metadata);
      if (!pinataResponse.success) {
        return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
        }
      }
      const tokenURI = pinataResponse.pinataUrl;
      console.log(tokenURI)
      setTokenURI(tokenURI)
    } catch (error) {
      console.log(error);
    }
  };

  async function onCheckAML(name) {
    try {
      console.log("onCheckAML called");
      if (!name) {
        return;
      }
      let amlCheckRes = await axiosHttpService(amlCheck(name));
      console.log("Status " + amlCheckRes.code);
      console.log("Body" + amlCheckRes.res);
      console.log("Error " + amlCheckRes.res["error"]);
      if (amlCheckRes.code === 200 && amlCheckRes.res["error"] === false) {
        if (amlCheckRes.res["matches"][name][0] &&
          amlCheckRes.res["matches"][name][0]["score"] >= process.env.REACT_APP_OFAC_MIN_SCORE) {
          return true;
        } else {
          return false;
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // On file upload (click the upload button)
  async function onFileUpload() {
    try {
      console.log("Upload called");
      let ipfsUploadRes = await axiosHttpService(uploadFileToIPFS(selectedFile));
      console.log(ipfsUploadRes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <header>
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button onClick={approveSendCoins}>Approve</button>
        <input type="file" onChange={(event) => setSelectedFile(event.target.files[0])} />
        <button onClick={onFileUpload}>
          Upload
        </button>
        <h5 style={{ textAlign: "center" }}>{tokenURI === "" ? <h5 >Upload your NFT before minting</h5> : tokenURI}</h5>
        <input type="text" onChange={(event) => setTokenURI(event.target.value)} />
        <button onClick={() => mint_NFT(tokenURI)}>
          Mint
        </button>
        <br />
        <input type="text" onChange={(event) => setNameForAMLCheck(event.target.value)} />
        <button onClick={() => onCheckAML(nameForAMLCheck)}>
          Check
        </button>
      </header>
    </div>
  );
}

export default Token;