import React, { useEffect, useState } from "react";
import DocumentCard from "../../tools/Card/DocumentCard";
import { useNavigate } from "react-router";
import { retrieveFiles } from "../../services/web3storageIPFS";
import {
  getBinaryFileData,
  getDataURLFromFile,
} from "../../services/fileHelper";

const BorrowerProfile = () => {
  const navigate = useNavigate();

  const [borrowerJson, setborrowerJson] = useState();
  const [logoImgSrc, setLogoImgSrc] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyRepName, setCompanyRepName] = useState();
  const [companyBio, setCompanyBio] = useState();
  const [website, setWebsite] = useState();
  const [email, setEmail] = useState();
  const [twitter, setTwitter] = useState();
  const [linkedin, setLinkedin] = useState();

  useEffect(async () => {
    // make the call to get borrower specific cid to fetch the data
    // currently we'll mock the cid
    let borrowerDataCID =
      "bafybeiaqaqrrd7r7pir2j3rzsr35qi74y2cndjnqd2qadvmlzzzn7jtayu";
    retrieveFiles(borrowerDataCID, true).then((res) => {
      if (res) {
        let read = getBinaryFileData(res);
        read.onloadend = function () {
          let brJson = JSON.parse(read.result);
          loadBorrowerData(brJson);
          setborrowerJson(brJson);
        };
      } else {
        // load the empty profile page
      }
    });
  }, []);

  const fetchBorrowerLogo = (imgcid) => {
    if (imgcid) {
      try {
        retrieveFiles(imgcid, true).then((imgFile) => {
          if (imgFile) {
            let read = getDataURLFromFile(imgFile);
            read.onloadend = function () {
              setLogoImgSrc(read.result);
            };
          } else {
            // set the empty logo image
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadBorrowerProfileData = (profileData) => {
    if (profileData) {
      try {
        if (profileData.companyName) {
          setCompanyName(profileData.companyName);
        }
        if (profileData.companyRepName) {
          setCompanyRepName(profileData.companyRepName);
        }
        if (profileData.companyBio) {
          setCompanyBio(profileData.companyBio);
        }
        if (profileData.website) {
          setWebsite(profileData.website);
        }
        if (profileData.email) {
          setEmail("mailto:" + profileData.email);
        }
        if (profileData.twitter) {
          setTwitter(profileData.twitter);
        }
        if (profileData.linkedin) {
          setLinkedin(profileData.linkedin);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadBorrowerData = (jsonData) => {
    try {
      if (jsonData) {
        // Load the Logo image if there is any
        fetchBorrowerLogo(jsonData.companyLogoCID);
        // Load rest of the data
        loadBorrowerProfileData(jsonData);

        console.log("work in progress");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToURl = (event) => {
    let url;
    switch (event.target.id) {
      case "twitter":
        url = twitter;
        break;
      case "linkedin":
        url = linkedin;
        break;
      case "website":
        url = website;
        break;
    }

    if (url) {
      let protocol = "https://";
      let position = url.search(protocol);
      // if there is no "https://" in the url then it is not opened correctly
      if (position === -1) {
        url = protocol + url;
      }
      window.open(url, "_blank");
    }
  };

  const redirectForEmail = () => {
    if (email) {
      window.location.href = email;
    }
  };

  return (
    <>
      <div className="mb-16 ">
        <h2 className="mb-6 text-2xl font-medium">Borrower Profile</h2>
        <div
          style={{ display: "flex" }}
          className="justify-between items-center mb-6"
        >
          <div style={{ display: "flex" }}>
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img src={logoImgSrc} />
              </div>
            </div>
            <div
              style={{ display: "flex" }}
              className="flex-col justify-center ml-4"
            >
              <h4 className="text-md">{companyName}</h4>
              <p className="text-xs">{companyRepName}</p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate("/borrower_dashboard/edit_profile", borrowerJson)
            }
            style={{ borderRadius: "100px", padding: "8px 16px" }}
            className="btn btn-sm btn-outline text-white"
          >
            Edit Profile
          </button>
        </div>

        <div className="w-full">
          <div className="w-1/2">
            <strong>Completer your KYC</strong>
            <div></div>
          </div>
        </div>

        <div
          style={{ display: "flex" }}
          className="w-full justify-between mb-6"
        >
          <div className="w-1/2">
            <h5 className="text-lg">Socials</h5>
          </div>
          <div style={{ display: "flex" }} className="w-1/2 justify-end">
            <button
              id="twitter"
              style={{ borderRadius: "100px", padding: "8px 16px" }}
              className="ml-3 btn btn-sm btn-outline text-white"
              onClick={redirectToURl}
            >
              Twitter
            </button>
            <button
              id="linkedin"
              style={{ borderRadius: "100px", padding: "8px 16px" }}
              className="ml-3 btn btn-sm btn-outline text-white"
              onClick={redirectToURl}
            >
              LinkedIn
            </button>
            <button
              style={{ borderRadius: "100px", padding: "8px 16px" }}
              className="ml-3 btn btn-sm btn-outline text-white"
              onClick={redirectForEmail}
            >
              Email
            </button>
            <button
              id="website"
              style={{ borderRadius: "100px", padding: "8px 16px" }}
              className="ml-3 btn btn-sm btn-outline text-white"
              onClick={redirectToURl}
            >
              Website
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h5 className="text-lg">Bio</h5>
          <p className="text-sm font-light text-justify"> {companyBio} </p>
        </div>

        <div className="mb-6">
          <h5 className="text-lg">KYC Details</h5>
          <DocumentCard></DocumentCard>
          <DocumentCard></DocumentCard>
        </div>
        <div className="mb-6">
          <h5 className="text-lg">KYB Details</h5>
          <h6 className="text-neutral text-sm">Business Identify Proof</h6>
          <DocumentCard></DocumentCard>
          <DocumentCard></DocumentCard>
          <h6 className="text-neutral text-sm">Business Address Proof</h6>
          <DocumentCard></DocumentCard>
          <h6 className="text-neutral text-sm">Business License Proof</h6>
          <DocumentCard></DocumentCard>
          <h6 className="text-neutral text-sm">Business Incorporation Proof</h6>
          <DocumentCard></DocumentCard>
        </div>
      </div>
    </>
  );
};

export default BorrowerProfile;
