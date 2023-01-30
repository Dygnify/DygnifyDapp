import React, { useEffect, useState } from "react";
import DocumentCard from "../../uiTools/Card/DocumentCard";
import { useNavigate, useLocation } from "react-router-dom";
import KYBModal from "./Components/Modal/KYB/KYBModal";
import { getUserWalletAddress } from "../../services/BackendConnectors/userConnectors/commonConnectors";
import Twitter from "../SVGIcons/Twitter";
import LinkedIn from "../SVGIcons/LinkedIn";
import Email from "../SVGIcons/Email";
import Website from "../SVGIcons/Website";
import Edits from "../SVGIcons/Edits";
import axiosHttpService from "../../services/axioscall";
import { kycOptions } from "../../services/KYC/blockpass";
import Loader from "../../uiTools/Loading/Loader";
import ErrorModal from "../../uiTools/Modal/ErrorModal";
import {
	getBorrowerJson,
	getBorrowerLogoURL,
} from "../../services/BackendConnectors/userConnectors/borrowerConnectors";
import { captureException } from "@sentry/react";
import { getExtendableTextBreakup } from "../../services/Helpers/displayTextHelper";
import { getTrimmedString } from "../../services/Helpers/displayTextHelper";

const BorrowerProfile = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [selected, setSelected] = useState(null);

	const [borrowerJson, setborrowerJson] = useState();
	const [logoImgSrc, setLogoImgSrc] = useState();
	const [companyName, setCompanyName] = useState();
	const [companyRepName, setCompanyRepName] = useState();
	// const [companyBio, setCompanyBio] = useState();
	const [website, setWebsite] = useState();
	const [email, setEmail] = useState();
	const [twitter, setTwitter] = useState();
	const [linkedin, setLinkedin] = useState();
	const location = useLocation();
	const [profileStatus, setProfileStatus] = useState(false);
	const [sustainableChecked, setSustainableChecked] = useState("");
	const [kycStatus, setKycStatus] = useState(false);
	const [hasKey, setHaskey] = useState();
	const [errormsg, setErrormsg] = useState({
		status: false,
		msg: "",
	});
	const [expand, setExpand] = useState(false);
	const [bio, setBio] = useState({
		isSliced: false,
		firstText: "",
		secondText: "",
	});

	const [stainableCheckBoxData, setStainableCheckBoxData] = useState("");
	const brJson = location.state;

	useEffect(() => {
		loadBorrowerProfileData();
		if (brJson) {
			let imgUrl = getBorrowerLogoURL(
				brJson.companyLogoFile.businessLogoFileCID,
				brJson.companyLogoFile.businessLogoFileName
			);
			if (imgUrl) {
				setLogoImgSrc(imgUrl);
			}

			setHaskey(brJson ? "businessLicFile" in brJson : false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function bioText(companyBio) {
		if (!companyBio || !companyBio) {
			return;
		}
		const { isSliced, firstText, secondText } = getExtendableTextBreakup(
			companyBio,
			200
		);

		if (isSliced) {
			setBio({
				firstText: firstText,
				secondText: secondText,
				isSliced: isSliced,
			});
		} else {
			setBio({
				firstText: firstText,
				isSliced: isSliced,
			});
		}
	}

	const handleForm = () => {
		setSelected(null);
	};

	const checkKyc = (refId) => {
		axiosHttpService(kycOptions(refId)).then((result) => {
			if (
				result.res.status === "success" &&
				result.res.data.status === "approved"
			) {
				setKycStatus(true);
			}
			if (result.res.status === "error") {
				setKycStatus(false);
			}
			console.log(result.res);
		});
	};

	const loadBlockpassWidget = (refId) => {
		const blockpass = new window.BlockpassKYCConnect(
			process.env.REACT_APP_CLIENT_ID,
			{
				refId: refId,
			}
		);

		blockpass.startKYCConnect();

		blockpass.on("KYCConnectSuccess", () => {
			//add code that will trigger when data have been sent.
		});
	};

	useEffect(() => {
		// make the call to get borrower specific cid to fetch the data
		// currently we'll mock the cid
		console.log("reached use Effect Borrower");
		getUserWalletAddress().then((res) => {
			if (res.success) {
				checkKyc(res.address);
				{
					!kycStatus && loadBlockpassWidget(res.address);
				}
			} else {
				console.log(res.msg);
				setErrormsg({
					status: !res.success,
					msg: res.msg,
				});
			}
		});

		const fetchData = async () => {
			getBorrowerJson()
				.then((dataReader) => {
					if (dataReader) {
						dataReader.onloadend = function () {
							let brJson = JSON.parse(dataReader.result);
							loadBorrowerData(brJson);
							setborrowerJson(brJson);
							setHaskey(brJson ? "businessLicFile" in brJson : false);
						};
					}
				})
				.catch((e) => {
					captureException(e);
				})
				.finally(() => {
					setLoading(false);
				});
		};

		if (!location.state) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadBorrowerProfileData = (profileData) => {
		let data;
		if (brJson) data = brJson;
		else data = profileData;
		if (data) {
			setProfileStatus(true);
		}
		setStainableCheckBoxData(data?.stainableCheckBoxData);

		if (data) {
			try {
				if (data.companyName) {
					setCompanyName(data.companyName);
				}
				if (data.companyRepName) {
					setCompanyRepName(data.companyRepName);
				}
				if (data.companyBio) {
					// setCompanyBio(data.companyBio);
					bioText(data.companyBio);
				}
				if (data.website) {
					setWebsite(data.website);
				}
				if (data.email) {
					setEmail("mailto:" + data.email);
				}
				if (data.twitter) {
					setTwitter(data.twitter);
				}
				if (data.linkedin) {
					setLinkedin(data.linkedin);
				}
				if (data.sustainableChecked) {
					setSustainableChecked(data.sustainableChecked);
				}
			} catch (error) {
				captureException(error);
			} finally {
				setLoading(false);
			}
		}
	};

	const loadBorrowerData = (jsonData) => {
		try {
			if (jsonData) {
				// Load the Logo image if there is any
				let imgUrl = getBorrowerLogoURL(
					jsonData.companyLogoFile.businessLogoFileCID,
					jsonData.companyLogoFile.businessLogoFileName
				);
				if (imgUrl) {
					setLogoImgSrc(imgUrl);
				}
				// Load rest of the data
				loadBorrowerProfileData(jsonData);

				console.log("work in progress");
			}
		} catch (error) {
			captureException(error);
		} finally {
			setLoading(false);
		}
	};

	const redirectToURl = (event) => {
		let url;
		let platform = event.target.id;

		switch (platform) {
			case "twitter":
				url = twitter;
				break;
			case "linkedin":
				url = linkedin;
				break;
			case "website":
				url = website;
				break;
			default:
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
			<div className="relative mb-16">
				{loading && <Loader />}
				<ErrorModal errormsg={errormsg} setErrormsg={setErrormsg} />
				<div className={`${loading ? "filter blur-sm" : ""}`}>
					{selected && <KYBModal handleForm={handleForm} />}
					{!profileStatus && (
						<div className="">
							<div className="flex items-center justify-between">
								<h2 className="font-semibold text-[1.4375rem] lg:text-[2.0625rem]">
									Borrower Profile
								</h2>

								<button
									onClick={() => navigate("/borrowerDashboard/editProfile")}
									className="CreateProfileIcon font-semibold border border-neutral-500 flex gap-1 items-center rounded-3xl py-2 px-3 sm:px-5"
								>
									<p>Create Profile</p>
									<Edits />
								</button>
							</div>
							<p className="justify-center flex text-[#64748B] mt-10">
								Complete your profile.
							</p>
						</div>
					)}
					{profileStatus ? (
						<>
							<div className="flex justify-between items-center">
								<div className="flex gap-2 items-center ">
									<div className="avatar">
										<div className="rounded-full w-20">
											<img
												alt=""
												src={
													logoImgSrc
														? logoImgSrc
														: require("../../assets/noImage.jpeg")
												}
											/>
										</div>
									</div>
									<div className=" font-semibold ">
										<p className="text-[1.1875rem]" title={companyName}>
											{companyName?.length > 20
												? getTrimmedString(companyName, 20)
												: companyName}
										</p>
										<p className="text-neutral-300">
											{companyRepName?.length > 20
												? getTrimmedString(companyRepName, 20)
												: companyRepName}
										</p>
									</div>
								</div>

								<button
									onClick={() =>
										navigate("/borrowerDashboard/editProfile", {
											state: borrowerJson ? borrowerJson : brJson,
										})
									}
									className="CreateProfileIcon border border-neutral-500 flex gap-1 items-center rounded-3xl py-2 px-3 sm:px-5"
								>
									<p>Edit Profile</p>
									<Edits />
								</button>
							</div>

							{!kycStatus ? (
								<div className="border border-r-[1.8rem] border-secondary-500 w-full md:w-[35rem] my-8 rounded-xl py-5 px-3 md:px-4 bg-lightmode-200 dark:bg-darkmode-800">
									<label id="blockpass-kyc-connect">
										<p className="font-semibold text-[1.1875rem]">
											Complete your KYC
										</p>
										<p>
											For Individuals - KYC verification includes verification
											of Identity Details and document verification such as
											utility bills as proof of address. Verifying your details
											ensures that you have a smooth and secure experience with
											us.
										</p>
									</label>
								</div>
							) : (
								<></>
							)}

							<div className=" font-semibold flex flex-col md:flex-row md:justify-between gap-2 mt-10">
								<h2 className="text-2xl font-semibold">Bio</h2>

								<div className=" flex gap-1 md:gap-3 ">
									{twitter ? (
										<button
											id="twitter"
											onClick={redirectToURl}
											className="CreateProfileIcon border border-neutral-500 flex gap-1 items-center py-1 px-2 rounded-2xl"
										>
											<Twitter />
											<p className="text-xs md:text-base pointer-events-none">
												twitter
											</p>
										</button>
									) : (
										<></>
									)}
									{linkedin ? (
										<button
											id="linkedin"
											onClick={redirectToURl}
											className="CreateProfileIcon border border-neutral-500 flex gap-1 items-center py-1 px-2 rounded-2xl"
										>
											<LinkedIn />
											<p className="text-xs md:text-base pointer-events-none">
												linkedIn
											</p>
										</button>
									) : (
										<></>
									)}
									{email ? (
										<button
											id="email"
											onClick={redirectForEmail}
											className="CreateProfileIcon border border-neutral-500 flex gap-1 items-center py-1 px-2 rounded-2xl"
										>
											<Email />
											<p className="text-xs md:text-base pointer-events-none">
												email
											</p>
										</button>
									) : (
										<></>
									)}
									{website ? (
										<button
											id="website"
											onClick={redirectToURl}
											className="border  border-neutral-500 flex gap-1 items-center py-1 px-2 rounded-2xl"
										>
											<Website />
											<p className="text-xs md:text-base pointer-events-none">
												website
											</p>
										</button>
									) : (
										<></>
									)}
								</div>
							</div>

							<div className="my-6">
								<div className="mt-1 text-lg css-fix">
									{/* {companyBio} */}
									{bio.isSliced ? (
										<div>
											{bio.firstText}
											<span
												className=" font-semibold cursor-pointer text-[#A0ABBB]"
												onClick={() => setExpand(true)}
											>
												{expand ? null : "... view more"}
											</span>
											{expand ? <div>{bio.secondText}</div> : null}
											<span
												className=" font-semibold cursor-pointer text-[#A0ABBB]"
												onClick={() => setExpand(false)}
											>
												{expand ? "view less" : null}
											</span>
										</div>
									) : (
										bio.firstText
									)}
								</div>
							</div>

							<div className="mb-8 font-semibold">
								<h3 className="text-[1.1875rem] mb-3">KYB Details</h3>
								<h5 className="text-[1.1875rem] text-neutral-400">
									Business Identify Proof
								</h5>
								<DocumentCard
									docName={
										brJson
											? brJson.businessIdFile.businessIdDocName
											: borrowerJson
											? borrowerJson.businessIdFile.businessIdDocName
											: ""
									}
									docCid={
										brJson
											? brJson.businessIdFile.businessIdFileCID
											: borrowerJson
											? borrowerJson.businessIdFile.businessIdFileCID
											: null
									}
									fileName={
										brJson
											? brJson.businessIdFile.businessIdFileName
											: borrowerJson
											? borrowerJson.businessIdFile.businessIdFileName
											: null
									}
								/>

								<h5 className="text-[1.1875rem] text-neutral-400">
									Business Address Proof
								</h5>
								<DocumentCard
									docName={
										brJson
											? brJson.businessAddFile.businessAddDocName
											: borrowerJson
											? borrowerJson.businessAddFile.businessAddDocName
											: null
									}
									docCid={
										brJson
											? brJson.businessAddFile.businessAddFileCID
											: borrowerJson
											? borrowerJson.businessAddFile.businessAddFileCID
											: null
									}
									fileName={
										brJson
											? brJson.businessAddFile.businessAddFileName
											: borrowerJson
											? borrowerJson.businessAddFile.businessAddFileName
											: null
									}
								/>
								<h5 className="text-[1.1875rem] text-neutral-400">
									Business Incorporation Proof
								</h5>
								<DocumentCard
									docName={
										brJson
											? brJson.businessIncoFile.businessIncoDocName
											: borrowerJson
											? borrowerJson.businessIncoFile.businessIncoDocName
											: null
									}
									docCid={
										brJson
											? brJson.businessIncoFile.businessIncoFileCID
											: borrowerJson
											? borrowerJson.businessIncoFile.businessIncoFileCID
											: null
									}
									fileName={
										brJson
											? brJson.businessIncoFile.businessIncoFileName
											: borrowerJson
											? borrowerJson.businessIncoFile.businessIncoFileName
											: null
									}
								/>
								<h5 className="text-[1.1875rem] text-neutral-400">
									Business License Proof
								</h5>
								{hasKey ? (
									<DocumentCard
										docName={
											brJson
												? brJson.businessLicFile.businessLicDocName
												: borrowerJson
												? borrowerJson.businessLicFile.businessLicDocName
												: null
										}
										docCid={
											brJson
												? brJson.businessLicFile.businessLicFileCID
												: borrowerJson
												? borrowerJson.businessLicFile.businessLicFileCID
												: null
										}
										fileName={
											brJson
												? brJson.businessLicFile.businessLicFileName
												: borrowerJson
												? borrowerJson.businessLicFile.businessLicFileName
												: null
										}
									/>
								) : (
									<DocumentCard docName={"No document added!"} disable={true} />
								)}

								{sustainableChecked.length > 0 && (
									<div className="collapse collapse-arrow bg-lightmode-200 dark:bg-[#24272F] outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] mt-7 rounded-xl">
										<input type="checkbox" className="peer" />

										<div className="collapse-title flex gap-4 md:gap-8 text-center">
											<p className="">Sustainable business</p>
										</div>
										<div className="collapse-content">
											<div className="font-semibold pt-2 pb-4">
												<div className="flex flex-col md:flex-row md:flex-wrap gap-[0.6em]">
													{sustainableChecked &&
														sustainableChecked.map((data) => (
															<div
																key={data}
																className="flex items-center md:w-[23%] pl-4 border dark:border-[#3A3C43] border-[#BBC0CC] rounded"
															>
																<svg
																	width="24"
																	height="24"
																	viewBox="0 0 24 24"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M6.28571 4.5C5.02514 4.5 4 5.52514 4 6.78571V18.2143C4 19.4749 5.02514 20.5 6.28571 20.5H17.7143C18.9749 20.5 20 19.4749 20 18.2143V6.78571C20 5.52514 18.9749 4.5 17.7143 4.5H6.28571ZM6.28571 18.2143V6.78571H17.7143L17.7166 18.2143H6.28571Z"
																		fill="#10B981"
																	/>
																	<path
																		d="M10.696 12.767L9.4 11.496L8 12.926L10.704 15.573L15.403 10.922L13.997 9.5L10.696 12.767Z"
																		fill="#10B981"
																	/>
																</svg>

																<label
																	htmlFor="bordered-checkbox-1"
																	className="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
																>
																	{data}
																</label>
															</div>
														))}
												</div>
											</div>
										</div>
									</div>
								)}

								{stainableCheckBoxData && (
									<div className="my-5 flex justify-between flex-wrap">
										{stainableCheckBoxData.map((item) => (
											<div key={item.name} className="w-1/2">
												<h2 className="text-[1.1875rem] mb-5 ">{item.name}</h2>
												<div className="w-[80%] dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
													<ul className="my-4 pt-5 pl-8 pr-8 pb-5 space-y-3">
														{item.data.map((data) => (
															<li
																key={data.title}
																className="flex justify-between items-center"
															>
																<div className="font-base">
																	<span className="flex-1  whitespace-nowrap">
																		{data.title}
																	</span>
																</div>
																<div>
																	<span className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[8rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none">
																		{data.value}
																	</span>
																</div>
															</li>
														))}
													</ul>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</>
					) : null}
				</div>
			</div>
		</>
	);
};

export default BorrowerProfile;
