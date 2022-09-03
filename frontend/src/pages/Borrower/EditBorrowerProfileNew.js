import React, { useState } from "react";
import { Formik } from "formik";
import TextField from "../../uiTools/Inputs/TextField";
import InputGroup from "../../uiTools/Inputs/InputGroup";
import TextArea from "../../uiTools/Inputs/TextArea";
import FileUploader from "../Components/FileUploader";
import { makeFileObjects, storeFiles } from "../../services/web3storageIPFS";
import { useLocation, useNavigate } from "react-router-dom";
import { updateBorrowerDetails } from "../../components/transaction/TransactionHelper";
import GradientButton from "../../uiTools/Button/GradientButton";

const EditBorrowerProfileNew = () => {
	const navigate = useNavigate();
	const initialValues = {
		companyName: "",
		companyRepName: "",
		companyBio: "",
		bizIdFileName: "",
		bizAddFileName: "",
		bizLicFileName: "",
		bizIncoFileName: "",
		website: "",
		email: "",
		twitter: "",
		linkedin: "",
	};
	const [profileState, setProfileState] = useState(null);
	const [hasKey, setHasKey] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();

	const [logoFile, setLogoFile] = useState();
	const [businessIdentityFiles, setBusinessIdentityFiles] = useState();
	const [businessAddressFiles, setBusinessAddressFiles] = useState();
	const [businessIncorporationFiles, setBusinessIncorporationFiles] =
		useState();
	const [businessLicenseFiles, setBusinessLicenseFiles] = useState();
	const location = useLocation();
	const oldBrJson = location.state;

	let logoFileCID = "";
	let businessIdFilesCID = "";
	let businessLicFilesCID = "";
	let businessAddFilesCID = "";
	let businessIncoFilesCID = "";

	let allowSubmit = true;

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

	const uploadBorrowerData = async (formData) => {
		const {
			companyName,
			companyRepName,
			companyBio,
			bizIdFileName,
			bizAddFileName,
			bizLicFileName,
			bizIncoFileName,
			website,
			email,
			twitter,
			linkedin,
		} = formData;
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
				companyName: companyName,
				companyRepName: companyRepName,
				companyBio: companyBio,
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

				website: website,
				email: email,
				twitter: twitter,
				linkedin: linkedin,
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

				let file = makeFileObjects(borrowerJsonData, "borrower.json");
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
		<div>
			<Formik
				initialValues={initialValues}
				onSubmit={(values) => uploadBorrowerData(values)}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
				}) => (
					<>
						<div className={loading ? "blur-sm" : ""}>
							<div className="mb-6">
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
										name="companyName"
										label="Company Name"
										placeholder="Enter Company Name"
										className="w-1/3"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.companyName}
										error={
											touched.companyName && errors.companyName
												? errors.companyName
												: null
										}
									/>
									<TextField
										name="companyRepName"
										label="Company Representative Name"
										placeholder="Enter Name"
										className="w-1/3"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.companyRepName}
										error={
											touched.companyRepName && errors.companyRepName
												? errors.companyRepName
												: null
										}
									/>
								</div>
								<div>
									<TextArea
										name="companyBio"
										label="Bio"
										placeholder="Summary About the Organization/Company"
										className="w-full"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.companyBio}
									/>
								</div>
							</div>

							<div className="mb-6">
								<h2 className="text-xl font-medium mb-2">KYB Documents</h2>
								<InputGroup
									caption="Business Identify Proof"
									name="bizIdFileName"
									value={values.bizIdFileName}
									onChangeText={handleChange}
									onChange={onBusinessIdentityFilesUpload}
									onBlur={handleBlur}
									error={error && "File required"}
									fileName={
										profileState
											? profileState.businessIdFile.businessIdFileName
											: ""
									}
								/>
								<InputGroup
									caption="Business Address Proof"
									name="bizAddFileName"
									value={values.bizAddFileName}
									onChangeText={handleChange}
									onChange={onBusinessAddressFilesUpload}
									onBlur={handleBlur}
									error={error && "File required"}
									fileName={
										profileState
											? profileState.businessAddFile.businessAddFileName
											: ""
									}
								/>
								<InputGroup
									caption="Business Incorporation Proof"
									name="bizIncoFileName"
									value={values.bizIncoFileName}
									onChangeText={handleChange}
									onChange={onBusinessIncorporationFilesUpload}
									onBlur={handleBlur}
									error={error && "File required"}
									fileName={
										profileState
											? profileState.businessIncoFile.businessIncoFileName
											: ""
									}
								/>
								<InputGroup
									caption="Business License Proof"
									name="bizLicFileName"
									value={values.bizLicFileName}
									onChangeText={handleChange}
									onChange={onBusinessLicenseFilesUpload}
									onBlur={handleBlur}
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
										name="website"
										label="Website"
										placeholder="Enter Website URL"
										className="w-1/2 mr-8"
										onChange={handleChange}
										value={values.website}
										onBlur={handleBlur}
									/>
									<TextField
										name="email"
										label="Email Address"
										placeholder="Enter Email Address"
										className="w-1/2 ml-8"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.email}
									/>{" "}
								</div>
								<div className="w-full" style={{ display: "flex" }}>
									<TextField
										name="twitter"
										label="Twitter"
										placeholder="Enter Twitter URL"
										className="w-1/2 mr-8"
										onChange={handleChange}
										value={values.twitter}
										onBlur={handleBlur}
									/>
									<TextField
										name="linkedin"
										label="LinkedIn"
										placeholder="Enter LinkedIn URL"
										className="w-1/2 ml-8"
										onChange={handleChange}
										value={values.linkedin}
										onBlur={handleBlur}
									/>
								</div>
							</div>

							<button type="submit" onClick={() => console.log(values)}>
								Submit
							</button>

							<div
								className={`my-10 justify-center flex-row-reverse ${
									loading ? "blur-sm" : ""
								}`}
								style={{ display: "flex" }}
							>
								<GradientButton
									className="font-medium ml-4"
									onClick={handleSubmit}
								>
									Save and Exit
								</GradientButton>

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
						</div>
					</>
				)}
			</Formik>
		</div>
	);
};

export default EditBorrowerProfileNew;
