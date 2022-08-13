import React, { useState, useRef, useEffect } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import FileFields from "../../tools/Inputs/FileFields";
import InputGroup from "../../tools/Inputs/InputGroup";
import TextArea from "../../tools/Inputs/TextArea";
import TextField from "../../tools/Inputs/TextField";
import FileUploader from "../Components/FileUploader";
import { storeFiles, makeFileObjects } from "../../services/web3storageIPFS";
import { updateBorrowerDetails } from "../../components/transaction/TransactionHelper";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();

  console.log(location.state);

  const onLogoFileUpload = (files) => {
    setLogoFile(files);
  };
  const onKYCFilesUpload = (files) => {
    setKYCFiles(files);
  };
  const onBusinessIdentityFilesUpload = (files) => {
    setBusinessIdentityFiles(files);
  };
  const onBusinessAddressFilesUpload = (files) => {
    setBusinessAddressFiles(files);
  };
  const onBusinessIncorporationFilesUpload = (files) => {
    setBusinessIncorporationFiles(files);
  };
  const onBusinessLicenseFilesUpload = (files) => {
    setBusinessLicenseFiles(files);
  };

  const {
    companyName: name,
    companyBio: bio,
    companyRepName: repName,
    businessIdFile: IdFile,
    businessAddFile: AddFile,
    businessIncoFile: IncoFile,
    businessLicFile: LicFile,
    companyLogoFile: LogoFile,
    website: web,
    twitter: twit,
    email: mail,
    linkedin: lin,
  } = location.state;

  useEffect(() => {
    companyName.current.value = name;
    companyRepName.current.value = repName;
    companyBio.current.value = bio;
    website.current.value = web;
    email.current.value = mail;
    twitter.current.value = twit;
    linkedin.current.value = lin;
    bizAddFileName.current.value = AddFile.businessAddDocName;
    bizIdFileName.current.value = IdFile.businessIdDocName;
    bizIncoFileName.current.value = IncoFile.businessIncoDocName;
    bizLicFileName.current.value = LicFile.businessLicDocName;
    setLogoFile(LogoFile);
  }, []);

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
        companyLogoFile: {
          businessLogoFileName: logoFile[0].name,
          businessLogoFileCID: logoFileCID,
        },
        kycFile: {
          //kycFileName: kycFileName.current.value,
          kycFileName: kycFileName,
          kycCID: kycFilesCID,
        },
        businessIdFile: {
          businessIdDocName: bizIdFileName.current.value,
          businessIdFileCID: businessIdFilesCID,
          businessIdFileName: businessIdentityFiles[0].name,
        },
        businessAddFile: {
          businessAddDocName: bizAddFileName.current.value,
          businessAddFileCID: businessAddFilesCID,
          businessAddFileName: businessAddressFiles[0].name,
        },
        businessIncoFile: {
          businessIncoDocName: bizIncoFileName.current.value,
          businessIncoFileCID: businessIncoFilesCID,
          businessIncoFileName: businessIncorporationFiles[0].name,
        },
        businessLicFile: {
          businessLicDocName: bizLicFileName.current.value,
          businessLicFileCID: businessLicFilesCID,
          businessLicFileName: businessLicenseFiles[0].name,
        },
        website: website.current.value,
        email: email.current.value,
        twitter: twitter.current.value,
        linkedin: linkedin.current.value,
      };

      //console.log(borrowerJsonData);
      let file = makeFileObjects(borrowerJsonData, Math.random());
      let borrowerDataCID = await storeFiles(file);
      // Save this CID in the blockchain
      console.log("DURING save", borrowerDataCID);
      console.log(borrowerJsonData);
      await updateBorrowerDetails(borrowerDataCID);
      console.log("upload successful");
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
            fileName={logoFile ? logoFile.businessLogoFileName : null}
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
      {/* <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">KYC Documents</h2>
        <InputGroup onChange={onKYCFilesUpload} reference={kycFileName} />
      </div> */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">KYB Documents</h2>
        <InputGroup
          caption="Business Identify Proof"
          onChange={onBusinessIdentityFilesUpload}
          reference={bizIdFileName}
          fileName={IdFile.businessIdFileName}
        />
        <InputGroup
          caption="Business Address Proof"
          onChange={onBusinessAddressFilesUpload}
          reference={bizAddFileName}
          fileName={AddFile.businessAddFileName}
        />
        <InputGroup
          caption="Business Incorporation Proof"
          onChange={onBusinessIncorporationFilesUpload}
          reference={bizIncoFileName}
          fileName={IncoFile.businessIncoFileName}
        />
        <InputGroup
          caption="Business License Proof"
          onChange={onBusinessLicenseFilesUpload}
          reference={bizLicFileName}
          fileName={LicFile.businessLicFileName}
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
