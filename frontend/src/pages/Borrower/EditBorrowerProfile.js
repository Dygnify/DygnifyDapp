import React, { useState, useRef } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import FileFields from "../../tools/Inputs/FileFields";
import InputGroup from "../../tools/Inputs/InputGroup";
import TextArea from "../../tools/Inputs/TextArea";
import TextField from "../../tools/Inputs/TextField";
import FileUploader from "../Components/FileUploader";
import { storeFiles, makeFileObjects } from "../../services/web3storageIPFS";

const EditBorrowerProfile = () => {
  const companyName = useRef();
  const companyRepName = useRef();
  const companyBio = useRef();
  const website = useRef();
  const email = useRef();
  const twitter = useRef();
  const linkedin = useRef();
  const kycFileName = useRef();
  const bizIdFileName = useRef();
  const bizAddFileName = useRef();
  const bizIncoFileName = useRef();
  const bizLicFileName = useRef();

  const [logoFile, setLogoFile] = useState();
  const [kycFiles, setKYCFiles] = useState();
  const [businessIdentityFiles, setBusinessIdentityFiles] = useState();
  const [businessAddressFiles, setBusinessAddressFiles] = useState();
  const [businessIncorporationFiles, setBusinessIncorporationFiles] =
    useState();
  const [businessLicenseFiles, setBusinessLicenseFiles] = useState();

  const onLogoFileUpload = (event) => {
    setLogoFile(event.target.files);
  };
  const onKYCFilesUpload = (event) => {
    setKYCFiles(event.target.files);
  };
  const onBusinessIdentityFilesUpload = (event) => {
    setBusinessIdentityFiles(event.target.files);
  };
  const onBusinessAddressFilesUpload = (event) => {
    setBusinessAddressFiles(event.target.files);
  };
  const onBusinessIncorporationFilesUpload = (event) => {
    setBusinessIncorporationFiles(event.target.files);
  };
  const onBusinessLicenseFilesUpload = (event) => {
    setBusinessLicenseFiles(event.target.files);
  };

  const uploadFilesToIPFS = async (files) => {
    try {
      if (files.length) {
        return await storeFiles(files);
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const uploadBorrowerData = async () => {
    try {
      // Insert all the files in one array
      let logoFileCID = "";
      if (logoFile && logoFile.length) {
        logoFileCID = await uploadFilesToIPFS(logoFile);
      }
      let kycFilesCID = "";
      if (kycFiles && kycFiles.length) {
        kycFilesCID = await uploadFilesToIPFS(kycFiles);
      }

      let businessIdFilesCID = "";
      if (businessIdentityFiles && businessIdentityFiles.length) {
        businessIdFilesCID = await uploadFilesToIPFS(businessIdentityFiles);
      }

      let businessAddFilesCID = "";
      if (businessAddressFiles && businessAddressFiles.length) {
        businessAddFilesCID = await uploadFilesToIPFS(businessAddressFiles);
      }

      let businessIncoFilesCID = "";
      if (businessIncorporationFiles && businessIncorporationFiles.length) {
        businessIncoFilesCID = await uploadFilesToIPFS(
          businessIncorporationFiles
        );
      }

      let businessLicFilesCID = "";
      if (businessLicenseFiles && businessLicenseFiles.length) {
        businessLicFilesCID = await uploadFilesToIPFS(businessLicenseFiles);
      }

      // Prepare a json file with borrower data
      let borrowerJsonData = {
        companyName: companyName.current.value,
        companyRepName: companyRepName.current.value,
        companyBio: companyBio.current.value,
        companyLogoCID: logoFileCID,
        kycFile: {
          kycFileName: kycFileName.current.value,
          kycCID: kycFilesCID,
        },
        businessIdFile: {
          businessIdFileName: bizIdFileName.current.value,
          businessIdFileCID: businessIdFilesCID,
        },
        businessAddFile: {
          businessAddFileName: bizAddFileName.current.value,
          businessAddFileCID: businessAddFilesCID,
        },
        businessIncoFile: {
          businessIncoFileName: bizIncoFileName.current.value,
          businessIncoFileCID: businessIncoFilesCID,
        },
        businessLicFile: {
          businessLicFileName: bizLicFileName.current.value,
          businessLicFileCID: businessLicFilesCID,
        },
        website: website.current.value,
        email: email.current.value,
        twitter: twitter.current.value,
        linkedin: linkedin.current.value,
      };

      console.log(borrowerJsonData);
      let file = makeFileObjects(borrowerJsonData, Math.random());
      let borrowerDataCID = await storeFiles(file);
      console.log(borrowerDataCID);
      // Need to save this CID in the blockchain
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium">Company Details</h2>
        <div style={{ display: "flex" }} className="w-full">
          <FileUploader
            label="Company Logo"
            className="w-1/3"
            handleFile={onLogoFileUpload}
          />
          <TextField
            label="Company Name"
            placeholder="Enter Company Name"
            className="w-1/3 ml-2"
            reference={companyName}
          />
          <TextField
            label="Company Representative Name"
            placeholder="Enter Name"
            className="w-1/3 ml-2"
            reference={companyRepName}
          ></TextField>
        </div>
        <div>
          <TextArea
            label="Bio"
            placeholder="Summary About the Organization/Company"
            className="w-full"
            reference={companyBio}
          ></TextArea>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">KYC Documents</h2>
        <InputGroup onChange={onKYCFilesUpload} reference={kycFileName} />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">KYB Documents</h2>
        <InputGroup
          caption="Business Identify Proof"
          onChange={onBusinessIdentityFilesUpload}
          reference={bizIdFileName}
        />
        <InputGroup
          caption="Business Address Proof"
          onChange={onBusinessAddressFilesUpload}
          reference={bizAddFileName}
        />
        <InputGroup
          caption="Business Incorporation Proof"
          onChange={onBusinessIncorporationFilesUpload}
          reference={bizIncoFileName}
        />
        <InputGroup
          caption="Business License Proof"
          onChange={onBusinessLicenseFilesUpload}
          reference={bizLicFileName}
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Socials</h2>
        <div className="w-full" style={{ display: "flex" }}>
          <TextField
            label="Website"
            placeholder="Enter Website URL"
            className="w-1/2 mr-8"
            reference={website}
          ></TextField>
          <TextField
            label="Email Address"
            placeholder="Enter Email Address"
            className="w-1/2 ml-8"
            reference={email}
          ></TextField>
        </div>
        <div className="w-full" style={{ display: "flex" }}>
          <TextField
            label="Twitter"
            placeholder="Enter Twitter URL"
            className="w-1/2 mr-8"
            reference={twitter}
          ></TextField>
          <TextField
            label="LinkedIn"
            placeholder="Enter LinkedIn URL"
            className="w-1/2 ml-8"
            reference={linkedin}
          ></TextField>
        </div>
      </div>
      <div className="my-10 justify-center" style={{ display: "flex" }}>
        <button
          style={{
            borderRadius: "100px",
            padding: "12px 24px",
            color: "white",
          }}
          className="btn btn-wide btn-outline text-white mr-4"
        >
          Exit
        </button>
        <GradientButton
          className="font-medium ml-4"
          onClick={uploadBorrowerData}
        >
          Save and Exit
        </GradientButton>
      </div>
    </div>
  );
};

export default EditBorrowerProfile;
