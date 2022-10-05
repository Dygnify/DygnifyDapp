import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import TextField from "../../uiTools/Inputs/TextField";
import InputGroup from "../../uiTools/Inputs/InputGroup";
import TextArea from "../../uiTools/Inputs/TextArea";
import FileUploader from "../Components/FileUploader";
import { useLocation, useNavigate } from "react-router-dom";
import GradientButton from "../../uiTools/Button/GradientButton";
import { getUserWalletAddress } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import * as Yup from "yup";
import Loader from "../../uiTools/Loading/Loader";
import { uploadFile, storeJSONData } from "../../services/Helpers/skynetIPFS";
import ProcessingModal from "./Components/Modal/FileUpload/ProcessingModal";

const EditBorrowerProfileNew = () => {
	const navigate = useNavigate();

	const [profileState, setProfileState] = useState(null);
	const [hasKey, setHasKey] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState();
	const [borrowerAddress, setBorrowerAddress] = useState();
	const [logoFile, setLogoFile] = useState();
	const [businessIdentityFiles, setBusinessIdentityFiles] = useState();
	const [businessAddressFiles, setBusinessAddressFiles] = useState();
	const [businessIncorporationFiles, setBusinessIncorporationFiles] =
		useState();
	const [businessLicenseFiles, setBusinessLicenseFiles] = useState();

	const [updating, setUpdating] = useState(true);

	const location = useLocation();
	const oldBrJson = location.state;

	let logoFileCID = useRef();
	let businessIdFilesCID = useRef();
	let businessLicFilesCID = useRef();
	let businessAddFilesCID = useRef();
	let businessIncoFilesCID = useRef();

	let allowSubmit = true;

	const validationSchema = Yup.object().shape({
		companyName: Yup.string().label("Company Name").required(),
		companyRepName: Yup.string()
			.label("Company Representative Name")
			.required(),
		companyBio: Yup.string().label("Company Bio").required(),
		bizIdFileName: Yup.string().label("File Name").required(),
		bizAddFileName: Yup.string().label("File Name").required(),
		bizLicFileName: Yup.string().label("File Name"),
		bizIncoFileName: Yup.string().label("File Name").required(),
		website: Yup.string().label("Website").required(),
	});

	useEffect(() => {
		if (location.state) {
			setProfileState(location.state);
			setHasKey(location.state ? "businessLicFile" in location.state : true);
		}
		getUserWalletAddress().then((res) => {
			if (res.success) {
				setBorrowerAddress(res.address);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const initialValues = {
		companyName: profileState ? profileState.companyName : "",
		companyRepName: profileState ? profileState.companyRepName : "",
		companyBio: profileState ? profileState.companyBio : "",
		bizIdFileName: profileState
			? profileState.businessIdFile.businessIdDocName
			: "",
		bizAddFileName: profileState
			? profileState.businessAddFile.businessAddDocName
			: "",
		bizLicFileName:
			profileState && hasKey
				? profileState.businessLicFile.businessLicDocName
				: "",
		bizIncoFileName: profileState
			? profileState.businessIncoFile.businessIncoDocName
			: "",
		website: profileState ? profileState.website : "",
		email: profileState ? profileState.email : "",
		twitter: profileState ? profileState.twitter : "",
		linkedin: profileState ? profileState.linkedin : "",
	};

	useEffect(() => {
		if (profileState) {
			const {
				businessIdFile: IdFile,
				businessAddFile: AddFile,
				businessIncoFile: IncoFile,
				businessLicFile: LicFile,
				companyLogoFile: LogoFile,
			} = profileState;

			if (hasKey) {
				businessLicFilesCID.current = LicFile.businessLicFileCID;
			}

			logoFileCID.current = LogoFile.businessLogoFileCID;
			businessIdFilesCID.current = IdFile.businessIdFileCID;

			businessAddFilesCID.current = AddFile.businessAddFileCID;
			businessIncoFilesCID.current = IncoFile.businessIncoFileCID;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profileState]);

	const uploadFilesToIPFS = async (files) => {
		try {
			if (files.length) {
				return await uploadFile(files[0]);
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
			setError(true);
			setUpdating(false);
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
		setUpdating(true);
		try {
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
						logoFileCID.current = await uploadFilesToIPFS(
							logoFile ? logoFile : profileState.companyLogoFile
						);
					}
				if (
					(businessIdentityFiles && businessIdentityFiles.length) ||
					profileState
				) {
					businessIdFilesCID.current = await uploadFilesToIPFS(
						businessIdentityFiles
							? businessIdentityFiles
							: profileState.businessIdFile
					);
				}
				if (
					(businessAddressFiles && businessAddressFiles.length) ||
					profileState
				) {
					businessAddFilesCID.current = await uploadFilesToIPFS(
						businessAddressFiles
							? businessAddressFiles
							: profileState.businessAddFile
					);
				}
				if (
					(businessIncorporationFiles && businessIncorporationFiles.length) ||
					profileState
				) {
					businessIncoFilesCID.current = await uploadFilesToIPFS(
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
					businessLicFilesCID.current = await uploadFilesToIPFS(
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
						? logoFileCID.current
						: profileState.companyLogoFile.businessLogoFileCID,
				},
				businessIdFile: {
					businessIdDocName: businessIdentityFiles
						? bizIdFileName
						: profileState.businessIdFile.businessIdDocName,
					businessIdFileCID: businessIdentityFiles
						? businessIdFilesCID.current
						: profileState.businessIdFile.businessIdFileCID,
					businessIdFileName: businessIdentityFiles
						? businessIdentityFiles[0].name
						: profileState.businessIdFile.businessIdFileName,
				},
				businessAddFile: {
					businessAddDocName: businessAddressFiles
						? bizAddFileName
						: profileState.businessAddFile.businessAddDocName,
					businessAddFileCID: businessAddressFiles
						? businessAddFilesCID.current
						: profileState.businessAddFile.businessAddFileCID,
					businessAddFileName: businessAddressFiles
						? businessAddressFiles[0].name
						: profileState.businessAddFile.businessAddFileName,
				},
				businessIncoFile: {
					businessIncoDocName: businessIncorporationFiles
						? bizIncoFileName
						: profileState.businessIncoFile.businessIncoDocName,
					businessIncoFileCID: businessIncorporationFiles
						? businessIncoFilesCID.current
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
							? bizLicFileName
							: profileState
							? profileState.businessLicFile.businessLicDocName
							: null,
						businessLicFileCID: businessLicenseFiles
							? businessLicFilesCID.current
							: profileState?.businessLicFile.businessLicFileCID,
						businessLicFileName: businessLicenseFiles
							? businessLicenseFiles[0].name
							: profileState?.businessLicFile.businessLicFileName,
					},
				};
				borrowerJsonData = { ...borrowerJsonData, ...licenseFile };
			}
			checkEdited(borrowerJsonData);

			if (allowSubmit && !error) {
				console.log("Inside allow");
				await storeJSONData(borrowerAddress, borrowerJsonData);
			}
			navigate("/borrowerDashboard/borrowerProfile", {
				state: borrowerJsonData,
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={`${loading ? "relative" : ""}`}>
			{<ProcessingModal setUpdating={setUpdating} updating={updating} />}

			{loading && <Loader />}

			<Formik
				initialValues={initialValues}
				onSubmit={(values) => uploadBorrowerData(values)}
				validationSchema={validationSchema}
				enableReinitialize={true}
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
							<div className="font-semibold">
								<div className="">
									<h2 className="text-[1.4375rem] ">Company Details</h2>

									<div className="mt-2 flex flex-col gap-2">
										<div className=" flex flex-col gap-2 md:flex-row md:flex-wrap xl:justify-between">
											<FileUploader
												label="Company Logo"
												className="md:w-[45%] xl:w-[30%]"
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
												className="md:w-[45%] md:ml-auto xl:ml-0 xl:w-[30%]"
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
												className="md:w-[45%] xl:w-[30%]"
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

										<div className="">
											<TextArea
												name="companyBio"
												label="Bio"
												placeholder="Summary About the Organization/Company"
												className="w-full"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.companyBio}
												error={
													touched.companyBio && errors.companyBio
														? errors.companyBio
														: null
												}
											/>
										</div>
									</div>
								</div>

								<div className="my-8 flex flex-col gap-3">
									<h2 className="text-[1.4375rem] font-semibold">
										KYB Documents
									</h2>

									<InputGroup
										caption="Business Identify Proof"
										name="bizIdFileName"
										value={values.bizIdFileName}
										onChangeText={handleChange}
										onChange={onBusinessIdentityFilesUpload}
										onBlur={handleBlur}
										error={error ? "File required" : errors.bizIdFileName}
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
										error={error ? "File required" : errors.bizAddFileName}
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
										error={error ? "File required" : errors.bizIncoFileName}
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
									<h2 className="text-[1.1875rem] ">Socials</h2>

									<div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-3">
										<TextField
											name="website"
											label="Website"
											placeholder="Enter Website URL"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											value={values.website}
											onBlur={handleBlur}
											error={errors.website}
										/>
										<TextField
											name="email"
											label="Email Address"
											placeholder="Enter Email Address"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.email}
										/>
										<TextField
											name="twitter"
											label="Twitter"
											placeholder="Enter Twitter URL"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											value={values.twitter}
											onBlur={handleBlur}
										/>
										<TextField
											name="linkedin"
											label="LinkedIn"
											placeholder="Enter LinkedIn URL"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											value={values.linkedin}
											onBlur={handleBlur}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="my-10 font-semibold flex flex-col gap-5 md:gap-8 md:flex-row md:justify-center">
							<button
								onClick={() =>
									navigate("/borrowerDashboard/borrowerProfile", {
										state: oldBrJson,
									})
								}
								className="border-2 border-neutral-500 rounded-3xl py-3 md:w-[40%] xl:w-[min(40%,25rem)]"
							>
								Exit
							</button>
							<GradientButton
								className="w-full md:w-[40%] xl:w-[min(40%,25rem)]"
								onClick={handleSubmit}
							>
								Save and Exit
							</GradientButton>
						</div>
					</>
				)}
			</Formik>
		</div>
	);
};

export default EditBorrowerProfileNew;
