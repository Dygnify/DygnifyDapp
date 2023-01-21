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
import ProcessingModal from "./Components/Modal/FileUpload/ProcessingModal";
import {
	makeFileObjects,
	storeFiles,
} from "../../services/Helpers/web3storageIPFS";
import { updateBorrowerDetails } from "../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { captureMessage } from "@sentry/react";
import { Field } from "formik";

const URL =
	/^((https?|ftp):\/\/)?(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

const EditBorrowerProfileNew = () => {
	const navigate = useNavigate();

	const [fileErr, setFileErr] = useState({
		bip: false,
		bap: false,
		bicp: false,
	});

	const [profileState, setProfileState] = useState(null);
	const [hasKey, setHasKey] = useState();
	const [loading, setLoading] = useState();
	const [error, setError] = useState({
		bip: false,
		bap: false,
		bicp: false,
	});
	const [borrowerAddress, setBorrowerAddress] = useState();
	const [logoFile, setLogoFile] = useState();
	const [businessIdentityFiles, setBusinessIdentityFiles] = useState();
	const [businessAddressFiles, setBusinessAddressFiles] = useState();
	const [businessIncorporationFiles, setBusinessIncorporationFiles] =
		useState();
	const [businessLicenseFiles, setBusinessLicenseFiles] = useState();

	const [uploading, setUploading] = useState(false);
	const [fileUploadStatus, setFileUploadStatus] = useState([]);
	const [logoError, setLogoError] = useState(false);
	const [checkLicense, setcheckLicense] = useState({
		err: false,
		msg: "",
	});

	// New updates start...................................................
	//Responsible Consumption And Production start
	const [checkedData, setcheckedData] = useState("");
	const [resConProdCheckState, setResConProdCheckState] = useState(false);
	const [resConProdData, setResConProdData] = useState([
		{ id: "e1", title: "Metric tonnes of Co2 reduced", value: 100 },
		{ id: "e2", title: "MW increase in RW generation", value: 200 },
	]);
	const [isEditresConProd, setIsEditResConProd] = useState(false);

	// console.log(profileState?.checkBoxData,"");

	const [formData, setformData] = useState({
		title: "",
		value: "",
	});

	const submitHandler = (event) => {
		event.preventDefault();
		setResConProdData((prev) => {
			{
				return [...prev, { id: Math.random().toString(), ...formData }];
			}
		});
		setformData({
			title: "",
			value: "",
		});
		setIsEditResConProd(false);
	};

	console.log(resConProdData, "🥅🥅🥅");

	const formChangeHandler = (event) => {
		let { name, value } = event.target;
		setformData((prev) => {
			return { ...prev, [name]: value };
		});
	};

	//Responsible Consumption And Production end

	//dummy data start
	// const [resConProdValues, setResConProdValues] = useState({
	// 	value0: "",
	// 	value1: "",
	// });

	// let sustainableDataDummy = [
	// 	{
	// 		id: "e1",
	// 		title: "Metric tonnes of Co2 reduced",
	// 		value: resConProdValues.value0,
	// 	},
	// 	{
	// 		id: "e2",
	// 		title: "MW increase in RW generation",
	// 		value: resConProdValues.value1,
	// 	},
	// ];

	//dummy data end

	//Climate Action start
	const [addNewFeild2, setAddNewFeild2] = useState(false);
	const [climateState, setClimateState] = useState(false);
	const [climateData, setClimateData] = useState({
		label1: "Metric tonnes of Co2 reduced",
		value1: "",
		label2: "MW increase in RW generation",
		value2: "",
	});

	//Climate Action end

	const sustainableCheckedData = [
		"No Poverty",
		"Zero Hunger",
		"Life On Land",
		"Climate Action",
		"Gender Equaltiy",
		"Life Below Water",
		"Quality Educatiion",
		"Reduced Inequalities",
		"Partnerships For The Goals",
		"Good Health And Well-Being",
		"Clean Water And Sanitation",
		"Affordable And Clean Energy",
		"Decent Work And Economic Growth",
		"Sustainable Cities And Communities",
		"Industry, Innovation And Infrastructure",
		"Responsible Consumption And Production",
		"Peace, Justice And Strong Institutions",
	];

	// New updates end.....................................................

	const [lincenseText, setLincenseText] = useState("");
	const [lincenseFile, setLincenseFile] = useState(false);
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
		bizIdFileName: Yup.string().required("File name is required"),
		bizAddFileName: Yup.string().required("File name is required"),
		bizLicFileName: Yup.string(),
		bizIncoFileName: Yup.string().required("File name is required"),
		website: Yup.string()
			.matches(URL, "Enter a valid url")
			.label("Website")
			.required(),
		email: Yup.string()
			.email("Invalid Email")
			.label("Email Address")
			.required(),
		twitter: Yup.string().matches(URL, "Enter a valid url"),
		linkedin: Yup.string().matches(URL, "Enter a valid url"),
	});

	useEffect(() => {
		if (location.state) {
			setProfileState(location.state);

			if (location.state?.checkBoxData.resConProdData.length > 0) {
				setResConProdData(location.state?.checkBoxData.resConProdData);
			}

			setHasKey(location.state ? "businessLicFile" in location.state : true);
		}
		getUserWalletAddress().then((res) => {
			if (res.success) {
				setBorrowerAddress(res.address);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (checkedData?.length >= 0) {
			const data = checkedData.includes(
				"Responsible Consumption And Production"
			);
			if (data) {
				setResConProdCheckState(true);
			} else {
				setResConProdCheckState(false);
			}
		}
		if (checkedData?.length >= 0) {
			const data = checkedData.includes("Climate Action");

			if (data) {
				setClimateState(true);
			} else {
				setClimateState(false);
			}
		}
	}, [checkedData]);

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
		checked: profileState ? profileState.sustainableChecked : "",
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
		checkFunction(null);

		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const checkEdited = (brJson) => {
		if (location.state) {
			if (JSON.stringify(brJson) === JSON.stringify(oldBrJson)) {
				return (allowSubmit = false);
			} //return setAllowSubmit(false);
		}
	};

	const validations = () => {
		// setLogoError(false);

		if (!logoFile && !location.state) setLogoError(true);

		const tempFileStatus = {
			bip: fileErr.bip,
			bap: fileErr.bap,
			bicp: fileErr.bicp,
		};

		if (!location.state) {
			if (!businessIdentityFiles) tempFileStatus.bip = true;

			if (!businessAddressFiles) tempFileStatus.bap = true;

			if (!businessIncorporationFiles) tempFileStatus.bicp = true;
		}

		setFileErr(tempFileStatus);

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
			setUploading(false);
		}
	};

	const onLogoFileUpload = (files) => {
		setLogoFile(files);
		setLogoError(false);
	};

	const onBusinessIdentityFilesUpload = (files) => {
		setBusinessIdentityFiles(files);
		setFileErr((prev) => {
			return {
				...prev,
				bip: false,
			};
		});
	};
	const onBusinessAddressFilesUpload = (files) => {
		setBusinessAddressFiles(files);
		setFileErr((prev) => {
			return {
				...prev,
				bap: false,
			};
		});
	};
	const onBusinessIncorporationFilesUpload = (files) => {
		setBusinessIncorporationFiles(files);
		setFileErr((prev) => {
			return {
				...prev,
				bicp: false,
			};
		});
	};
	const onBusinessLicenseFilesUpload = (files) => {
		setBusinessLicenseFiles(files);
		checkFunction(files);
	};

	const uploadBorrowerData = async (formData) => {
		setUploading(true);
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
				checked,
			} = formData;

			validations();
			let key = false;
			let tempFileStatus = [];
			if (businessLicenseFiles) key = true;

			if (!logoError || !fileErr.bip || !fileErr.bap || !fileErr.bicp) {
				if (logoFile && logoFile.length) {
					let logoFileObj = {
						fileName: logoFile[0].name,
						progress: 0,
						status: "Pending",
					};

					tempFileStatus.push(logoFileObj);
				}

				if (businessIdentityFiles && businessIdentityFiles.length) {
					let businessIdentityFilesObj = {
						fileName: businessIdentityFiles[0].name,
						progress: 0,
						status: "Pending",
					};

					tempFileStatus.push(businessIdentityFilesObj);
				}

				if (businessAddressFiles && businessAddressFiles.length) {
					let businessAddressFilesObj = {
						fileName: businessAddressFiles[0].name,
						progress: 0,
						status: "Pending",
					};

					tempFileStatus.push(businessAddressFilesObj);
				}

				if (businessIncorporationFiles && businessIncorporationFiles.length) {
					let businessIncorporationFilesObj = {
						fileName: businessIncorporationFiles[0].name,
						progress: 0,
						status: "Pending",
					};

					tempFileStatus.push(businessIncorporationFilesObj);
				}

				if (businessLicenseFiles && businessLicenseFiles.length) {
					let businessLicenseFilesObj = {
						fileName: businessLicenseFiles[0].name,
						progress: 0,
						status: "Pending",
					};

					tempFileStatus.push(businessLicenseFilesObj);
				}

				console.log(tempFileStatus);
				setFileUploadStatus(tempFileStatus);

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

				let checkBoxData = {
					resConProdData: resConProdCheckState ? resConProdData : [],
					climateData: climateState ? climateData : [],
				};

				// Prepare a json file with borrower data
				let borrowerJsonData = {
					checkBoxData: checkBoxData,
					sustainableChecked: checked,
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

				if (allowSubmit) {
					let file = makeFileObjects(borrowerJsonData, "borrower.json");
					let borrowerDataCID = await storeFiles(file);
					// Save this CID in the blockchain
					await updateBorrowerDetails(borrowerDataCID);
					captureMessage(
						"Borrower profile updted successful on blockchain",
						"info"
					);
				}
				navigate("/borrowerDashboard/borrowerProfile", {
					state: borrowerJsonData,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	function checkFunction(file) {
		console.log("checkfun");
		if (file || businessLicFilesCID.current) {
			setLincenseFile(true);
		}
	}

	useEffect(() => {
		console.log(lincenseFile);
		if (lincenseText && lincenseFile) {
			setcheckLicense({
				err: false,
				msg: "",
			});
		} else {
			console.log(lincenseFile);

			if (!lincenseFile && lincenseText) {
				setcheckLicense({
					err: true,
					msg: "File required",
				});
			} else if (!lincenseText && lincenseFile) {
				setcheckLicense({
					err: true,
					msg: "File name is required",
				});
			} else {
				setcheckLicense({
					err: false,
					msg: "",
				});
			}
		}
	}, [lincenseText, lincenseFile]);

	return (
		<div className={`${loading ? "relative" : ""}`}>
			{
				<ProcessingModal
					setUploading={setUploading}
					uploading={uploading}
					fileUploadStatus={fileUploadStatus}
				/>
			}

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
						{setLincenseText(values.bizLicFileName)}
						<div className={loading ? "blur-sm" : ""}>
							<div className="font-semibold">
								<div className="">
									<h2 className="text-[1.4375rem] ">Company Details</h2>

									{setcheckedData(values.checked)}
									<div className="mt-2 flex flex-col gap-2">
										<div className=" flex flex-col gap-2 md:flex-row md:flex-wrap xl:justify-between">
											<FileUploader
												filetype={"image/*"}
												label="Company Logo"
												className="md:w-[45%] xl:w-[30%]"
												handleFile={onLogoFileUpload}
												fileName={
													profileState
														? profileState.companyLogoFile.businessLogoFileName
														: null
												}
												error={logoError ? "Please upload logo!" : null}
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
										error={
											errors.bizIdFileName && touched.bizIdFileName
												? errors.bizIdFileName
												: fileErr.bip
												? "File required"
												: ""
										}
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
										error={
											errors.bizAddFileName && touched.bizAddFileName
												? errors.bizAddFileName
												: fileErr.bap
												? "File required"
												: ""
										}
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
										error={
											errors.bizIncoFileName && touched.bizIncoFileName
												? errors.bizIncoFileName
												: fileErr.bicp
												? "File required"
												: ""
										}
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
										error={checkLicense.err ? checkLicense.msg : ""}
										onBlur={handleBlur}
										fileName={
											profileState && hasKey
												? profileState.businessLicFile.businessLicFileName
												: ""
										}
									/>
								</div>

								<div className="collapse collapse-arrow bg-lightmode-200 dark:bg-[#24272F] outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC]  rounded-xl mb-5">
									<input type="checkbox" className="peer" />

									<div className="collapse-title flex gap-4 md:gap-8 text-center">
										<p className="">Sustainable business</p>
									</div>

									<div className="collapse-content ">
										<div className="font-semibold pt-8 pb-4">
											<div className="flex flex-col  md:flex-row md:flex-wrap gap-[0.7em] justify-center">
												{sustainableCheckedData.map((data) => (
													<div class="flex items-center md:w-[23%] pl-4 border dark:border-[#3A3C43] border-[#BBC0CC] rounded">
														<label class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-2">
															<Field
																type="checkbox"
																name="checked"
																value={data}
																class="w-[0.9rem] h-[0.9rem] text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
															/>
															{data}
														</label>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>

								{/* card  start*/}

								<div className="flex justify-between">
									{resConProdCheckState && (
										<div>
											<h2 className="text-[1.1875rem] mb-5 ">
												Responsible Consumption and Production
											</h2>

											<div class="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
												<ul class="my-4 pt-5 pl-8 pr-8 space-y-3">
													{/* {sustainableDataDummy.map((data, index) => (
														<li
															key={data.id}
															className="flex justify-between items-center"
														>
															<div className="font-base">
																<span class="flex-1  whitespace-nowrap">
																	{data.title}
																</span>
															</div>
															<div>
																<input
																	type="text"
																	value={data.value}
																	onChange={(e) => {
																		let value = `value${index}`;
																		setResConProdValues((prev) => {
																			return {
																				...prev,
																				[value]: e.target.value,
																			};
																		});
																	}}
																	placeholder="Enter value"
																	className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
																/>
															</div>
														</li>
													))} */}

													{resConProdData.map((data) => (
														<li
															key={data.id}
															className="flex justify-between items-center"
														>
															<div className="font-base">
																<span class="flex-1  whitespace-nowrap">
																	{data.title}
																</span>
															</div>
															<div>
																<input
																	type="text"
																	value={data.value}
																	placeholder="Enter value"
																	className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
																/>
															</div>
														</li>
													))}
												</ul>

												{!isEditresConProd && (
													<button
														onClick={() => {
															setIsEditResConProd(true);
														}}
														type="button"
														class="py-2.5  ml-[25rem] px-5 mr-7 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
													>
														Add New
													</button>
												)}

												{isEditresConProd && (
													<form onSubmit={submitHandler}>
														<div className="flex justify-between items-center pb-4 mx-8">
															<div className="font-base">
																<input
																	type="text"
																	name="title"
																	value={formData.title}
																	onChange={formChangeHandler}
																	placeholder="Enter label"
																	className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[14rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
																/>
															</div>
															<div className="font-base">
																<input
																	type="text"
																	name="value"
																	value={formData.value}
																	onChange={formChangeHandler}
																	placeholder="Enter value"
																	className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
																/>
															</div>
														</div>

														<button
															type="submit"
															class="py-2.5  ml-[25rem] px-5 mr-7 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
														>
															Add more
														</button>
													</form>
												)}
											</div>
										</div>
									)}

									{climateState && (
										<div>
											<h2 className="text-[1.1875rem] mb-5 ">Climate Action</h2>

											<div class="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
												<ul class="my-4 pt-5 pl-8 pr-8 space-y-3">
													<li className="flex justify-between items-center">
														<div className="font-base">
															<span class="flex-1  whitespace-nowrap">
																Metric tonnes of Co2 reduced
															</span>
														</div>
														<div>
															<input
																type="text"
																onChange={(e) => {
																	console.log(e.target.value);
																	setClimateData({
																		label1: "Metric tonnes of Co2 reduced",
																		value1: e.target.value,
																		label2: "MW increase in RW generation",
																		value2: climateData.value2,
																	});
																	console.log(climateData);
																}}
																placeholder="Enter value"
																className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
															/>
														</div>
													</li>
													<li className="flex justify-between items-center">
														<div className="font-base">
															<span class="flex-1  whitespace-nowrap">
																MW increase in RW generation
															</span>
														</div>
														<div>
															<input
																type="text"
																onChange={(e) => {
																	console.log(e.target.value);
																	setClimateData({
																		label1: "Metric tonnes of Co2 reduced",
																		value1: climateData.value1,
																		label2: "MW increase in RW generation",
																		value2: e.target.value,
																	});
																	console.log(climateData);
																}}
																placeholder="Enter value"
																className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
															/>
														</div>
													</li>
												</ul>

												<button
													onClick={() => {
														setAddNewFeild2((prev) => !prev);
													}}
													type="button"
													class="py-2.5  ml-[25rem] px-5 mr-7 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
												>
													Add more
												</button>

												{addNewFeild2 && (
													<div className="flex justify-evenly items-center pb-5">
														<div className="font-base">
															<input
																type="text"
																placeholder="Enter label"
																className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
															/>
														</div>
														<div>
															<input
																type="text"
																placeholder="Enter value"
																className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
															/>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</div>

								{/* card  end*/}
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
											error={
												touched.website && errors.website ? errors.website : ""
											}
										/>
										<TextField
											name="email"
											label="Email Address"
											placeholder="Enter Email Address"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.email}
											error={touched.email && errors.email ? errors.email : ""}
										/>
										<TextField
											name="twitter"
											label="Twitter"
											placeholder="Enter Twitter URL"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											value={values.twitter}
											onBlur={handleBlur}
											error={
												touched.twitter && errors.twitter ? errors.twitter : ""
											}
										/>
										<TextField
											name="linkedin"
											label="LinkedIn"
											placeholder="Enter LinkedIn URL"
											className="w-full md:w-[48%]"
											onChange={handleChange}
											value={values.linkedin}
											onBlur={handleBlur}
											error={
												touched.linkedin && errors.linkedin
													? errors.linkedin
													: ""
											}
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
								onClick={() => {
									validations();
									if (!checkLicense.err) {
										handleSubmit();
									}
								}}
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
