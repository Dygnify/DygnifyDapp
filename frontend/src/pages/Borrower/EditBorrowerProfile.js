import React, { useState, useRef, useEffect, Profiler } from "react";
import GradientButton from "../../tools/Button/GradientButton";
import FileFields from "../../tools/Inputs/FileFields";
import InputGroup from "../../tools/Inputs/InputGroup";
import TextArea from "../../tools/Inputs/TextArea";
import TextField from "../../tools/Inputs/TextField";
import FileUploader from "../Components/FileUploader";
import { storeFiles, makeFileObjects } from "../../services/web3storageIPFS";
import { updateBorrowerDetails } from "../../components/transaction/TransactionHelper";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";

const EditBorrowerProfile = () => {
  const navigate = useNavigate();

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

  const [profileState, setProfileState] = useState();

  //const [allowSubmit, setAllowSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [hasKey, setHasKey] = useState();
  const oldBrJson = location.state;
  const [error, setError] = useState();

  let logoFileCID = "";
  let kycFilesCID = "";
  let businessIdFilesCID = "";
  let businessLicFilesCID = "";
  let businessAddFilesCID = "";
  let businessIncoFilesCID = "";

  let allowSubmit = true;

  const checkEdited = (brJson) => {
    if (location.state) {
      if (JSON.stringify(brJson) === JSON.stringify(oldBrJson)) {
        return (allowSubmit = false);
      } //return setAllowSubmit(false);
    }
  };

  const validations = () => {
    if (
      !(
        businessIdentityFiles &&
        businessIncorporationFiles &&
        businessAddressFiles &&
        logoFile
      ) &&
      !location.state
    ) {
      return setError(true);
    }
  };

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

  useEffect(() => {
    console.log("location*****", location.state);
    if (location.state) {
      setProfileState(location.state);
      setHasKey(location.state ? "businessLicFile" in location.state : true);
    }
  }, []);

  useEffect(() => {
    if (profileState) {
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
      } = profileState;

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

      if (hasKey) {
        bizLicFileName.current.value = LicFile.businessLicDocName;

        businessLicFilesCID = LicFile.businessLicFileCID;
      }

      // setLogoFile(LogoFile);
      // console.log(bizAddFileName.current.value);
      // setBusinessAddressFiles(AddFile);
      // setBusinessIdentityFiles(IdFile);
      // setBusinessIncorporationFiles(IncoFile);
      // setBusinessLicenseFiles(LicFile);

      logoFileCID = LogoFile.businessLogoFileCID;
      businessIdFilesCID = IdFile.businessIdFileCID;

      businessAddFilesCID = AddFile.businessAddFileCID;
      businessIncoFilesCID = IncoFile.businessIncoFileCID;
    }
  }, [profileState]);

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
    setLoading(true);
    try {
      //Insert all the files in one array
      validations();

      let key = false;
      if (businessLicenseFiles) key = true;

      {
        if (
          businessIdentityFiles ||
          businessAddressFiles ||
          businessIncorporationFiles ||
          businessLicenseFiles ||
          logoFile
        )
          if ((logoFile && logoFile.length) || profileState) {
            logoFileCID = await uploadFilesToIPFS(
              logoFile ? logoFile : profileState.companyLogoFile
            );
          }

        if (
          (businessIdentityFiles && businessIdentityFiles.length) ||
          profileState
        ) {
          businessIdFilesCID = await uploadFilesToIPFS(
            businessIdentityFiles
              ? businessIdentityFiles
              : profileState.businessIdFile
          );
        }

        if (
          (businessAddressFiles && businessAddressFiles.length) ||
          profileState
        ) {
          businessAddFilesCID = await uploadFilesToIPFS(
            businessAddressFiles
              ? businessAddressFiles
              : profileState.businessAddFile
          );
        }

        if (
          (businessIncorporationFiles && businessIncorporationFiles.length) ||
          profileState
        ) {
          businessIncoFilesCID = await uploadFilesToIPFS(
            businessIncorporationFiles
              ? businessIncorporationFiles
              : profileState.businessIncoFile
          );
        }

        if (
          (businessLicenseFiles &&
            businessLicenseFiles.length &&
            (hasKey || key)) ||
          (profileState && (hasKey || key))
        ) {
          businessLicFilesCID = await uploadFilesToIPFS(
            businessLicenseFiles
              ? businessLicenseFiles
              : profileState.businessLicFile
          );
        }
      }
      // Prepare a json file with borrower data
      let borrowerJsonData = {
        companyName: companyName.current.value,
        companyRepName: companyRepName.current.value,
        companyBio: companyBio.current.value,
        companyLogoFile: {
          businessLogoFileName: logoFile
            ? logoFile[0].name
            : profileState.companyLogoFile.businessLogoFileName,
          businessLogoFileCID: logoFile
            ? logoFileCID
            : profileState.companyLogoFile.businessLogoFileCID,
        },

        businessIdFile: {
          businessIdDocName: businessIdentityFiles
            ? bizIdFileName.current.value
            : profileState.businessIdFile.businessIdDocName,
          businessIdFileCID: businessIdentityFiles
            ? businessIdFilesCID
            : profileState.businessIdFile.businessIdFileCID,
          businessIdFileName: businessIdentityFiles
            ? businessIdentityFiles[0].name
            : profileState.businessIdFile.businessIdFileName,
        },
        businessAddFile: {
          businessAddDocName: businessAddressFiles
            ? bizAddFileName.current.value
            : profileState.businessAddFile.businessAddDocName,
          businessAddFileCID: businessAddressFiles
            ? businessAddFilesCID
            : profileState.businessAddFile.businessAddFileCID,
          businessAddFileName: businessAddressFiles
            ? businessAddressFiles[0].name
            : profileState.businessAddFile.businessAddFileName,
        },
        businessIncoFile: {
          businessIncoDocName: businessIncorporationFiles
            ? bizIncoFileName.current.value
            : profileState.businessIncoFile.businessIncoDocName,
          businessIncoFileCID: businessIncorporationFiles
            ? businessIncoFilesCID
            : profileState.businessIncoFile.businessIncoFileCID,
          businessIncoFileName: businessIncorporationFiles
            ? businessIncorporationFiles[0].name
            : profileState.businessIncoFile.businessIncoFileName,
        },

        website: website.current.value,
        email: email.current.value,
        twitter: twitter.current.value,
        linkedin: linkedin.current.value,
      };

      if ((businessLicenseFiles || profileState) && (hasKey || key)) {
        const licenseFile = {
          businessLicFile: {
            businessLicDocName: businessLicenseFiles
              ? bizLicFileName.current.value
              : profileState
              ? profileState.businessLicFile.businessLicDocName
              : null,
            businessLicFileCID: businessLicenseFiles
              ? businessLicFilesCID
              : profileState?.businessLicFile.businessLicFileCID,
            businessLicFileName: businessLicenseFiles
              ? businessLicenseFiles[0].name
              : profileState?.businessLicFile.businessLicFileName,
          },
        };

        borrowerJsonData = { ...borrowerJsonData, ...licenseFile };
      }

      checkEdited(borrowerJsonData);
      console.log(borrowerJsonData, hasKey, key);
      console.log(allowSubmit, "error", error);
      if (allowSubmit && !error) {
        console.log("Inside allow");

        let file = makeFileObjects(borrowerJsonData, Math.random());
        let borrowerDataCID = await storeFiles(file);
        // Save this CID in the blockchain
        console.log("DURING save", borrowerDataCID);
        console.log(borrowerJsonData);
        await updateBorrowerDetails(borrowerDataCID);
        console.log("upload successful");
      }
      navigate("/borrower_dashboard/borrower_profile", {
        state: borrowerJsonData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={loading ? "blur-sm" : null}>
        <div className="mb-6">
          {error ? (
            <h6 
              className="text-[#EF4444]" 
              // style={{ color: "red" }}
            >
              Please upload all the required details.
            </h6>
          ) : (
            <></>
          )}
          <h2 className="text-xl font-medium">Company Details</h2>
          <div 
            style={{ 
              display: "flex", 
          }} 
            className="gap-3 w-full mx-0"
          >
            <FileUploader
              label="Company Logo"
              className="w-1/3"
              handleFile={onLogoFileUpload}
              fileName={
                profileState
                  ? profileState.companyLogoFile.businessLogoFileName
                  : null
              }
            />
            <TextField
              label="Company Name"
              placeholder="Enter Company Name"
              className="w-1/3"
              reference={companyName}
            />
            <TextField
              label="Company Representative Name"
              placeholder="Enter Name"
              className="w-1/3"
              reference={companyRepName}
            />
          </div>
          <div>
            <TextArea
              label="Bio"
              placeholder="Summary About the Organization/Company"
              className="w-full"
              reference={companyBio}
            />
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
            error={error && "File required"}
            fileName={
              profileState ? profileState.businessIdFile.businessIdFileName : ""
            }
          />
          <InputGroup
            caption="Business Address Proof"
            onChange={onBusinessAddressFilesUpload}
            reference={bizAddFileName}
            error={error && "File required"}
            fileName={
              profileState
                ? profileState.businessAddFile.businessAddFileName
                : ""
            }
          />
          <InputGroup
            caption="Business Incorporation Proof"
            onChange={onBusinessIncorporationFilesUpload}
            reference={bizIncoFileName}
            error={error && "File required"}
            fileName={
              profileState
                ? profileState.businessIncoFile.businessIncoFileName
                : ""
            }
          />
          <InputGroup
            caption="Business License Proof"
            onChange={onBusinessLicenseFilesUpload}
            reference={bizLicFileName}
            fileName={
              profileState && hasKey
                ? profileState.businessLicFile.businessLicFileName
                : ""
            }
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
            />
            <TextField
              label="Email Address"
              placeholder="Enter Email Address"
              className="w-1/2 ml-8"
              reference={email}
            />
          </div>
          <div className="w-full" style={{ display: "flex" }}>
            <TextField
              label="Twitter"
              placeholder="Enter Twitter URL"
              className="w-1/2 mr-8"
              reference={twitter}
            />
            <TextField
              label="LinkedIn"
              placeholder="Enter LinkedIn URL"
              className="w-1/2 ml-8"
              reference={linkedin}
            />
          </div>
        </div>
      </div>

      <div className="my-10 justify-center flex-row-reverse" style={{ display: "flex" }} >

        {loading ? (
            <Loading />
          ) : (
            <GradientButton
              className="font-medium ml-4"
              onClick={uploadBorrowerData}
            >
              Save and Exit
            </GradientButton>
          )}
        <button
          style={{
            borderRadius: "100px",
            padding: "12px 24px",
            color: "white",
          }}
          className="btn btn-wide btn-outline text-white mr-4 focus:outline-[#9281FF]"
          onClick={() =>
            navigate("/borrower_dashboard/borrower_profile", {
              state: oldBrJson,
            })
          }
        >
          Exit
        </button>
        
      </div>
    </>
  );
};

export default EditBorrowerProfile;
