import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { voteOpportunity } from "../../components/transaction/TransactionHelper";
import { getExtendableTextBreakup } from "../../services/displayTextHelper";
import DocumentCard from "../../uiTools/Card/DocumentCard";
import Email from "../SVGIcons/Email";
import LinkedIn from "../SVGIcons/LinkedIn";
import Twitter from "../SVGIcons/Twitter";
import Website from "../SVGIcons/Website";
import Loader from "../../uiTools/Loading/Loader";

const PoolDetails = () => {
	const location = useLocation();
	const [expand, setExpand] = useState(false);
	const [approveStatus, setApproveStatus] = useState(false);
	const [opDetails, setOpDetails] = useState();
	const [companyDetails, setCompanyDetails] = useState();
	const [info, setInfo] = useState([]);
	const [loanPurpose, setLoanPurpose] = useState({
		isSliced: false,
		firstText: "",
		secondText: "",
	});

	const [status, setStatus] = useState({
		approve: false,
		unsure: false,
		reject: false,
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setOpDetails(location.state);
	}, []);

	useEffect(() => {
		if (opDetails) {
			loadInfo();
			loadLoanPurpose();
			setCompanyDetails(opDetails.companyDetails);
			console.log(opDetails.companyDetails);
		}
	}, [opDetails]);

	function loadInfo() {
		if (opDetails) {
			setInfo([
				{
					label: "Opening Date",
					value: opDetails.createdOn ? opDetails.createdOn : "--",
				},
				{
					label: "Payment Frequency",
					value: opDetails.paymentFrequencyInDays
						? opDetails.paymentFrequencyInDays
						: "--",
				},
				{
					label: "Borrower Address",
					value: opDetails.borrowerDisplayAdd
						? opDetails.borrowerDisplayAdd
						: "--",
				},
				{
					label: "Interest Rate",
					value: opDetails.loanInterest ? opDetails.loanInterest : "--",
				},
				{
					label: "Payment Tenure",
					value: opDetails.loanTenure ? opDetails.loanTenure : "--",
				},
				{
					label: "Drawdown Cap",
					value: opDetails.opportunityAmount
						? opDetails.opportunityAmount
						: "--",
				},
			]);
			console.log(info);
		}
	}

	function loadLoanPurpose() {
		if (!opDetails || !opDetails.loan_purpose) {
			return;
		}
		const { isSliced, firstText, secondText } = getExtendableTextBreakup(
			opDetails.loan_purpose,
			200
		);

		if (isSliced) {
			setLoanPurpose({
				firstText: firstText,
				secondText: secondText,
				isSliced: isSliced,
			});
		} else {
			setLoanPurpose({
				firstText: firstText,
				isSliced: isSliced,
			});
		}
	}

	function updateStatus(vote) {
		if (vote == "1") {
			setStatus({ approve: false, unsure: false, reject: true });
		} else if (vote == "2") {
			setStatus({ approve: true, unsure: false, reject: false });
		} else if (vote == "3") {
			setStatus({ approve: false, unsure: true, reject: false });
		}
	}

	async function vote(voteID) {
		setLoading(true);
		const result = await voteOpportunity(opDetails.id, voteID);
		if (result) {
			updateStatus(voteID);
		}

		setLoading(false);
	}

	return (
		<div className={`${loading ? "" : ""}`}>
			{loading && <Loader x="shift" />}
			<div className={`${loading ? "blur-sm" : ""}`}>
				{/* main container  */}
				<div>
					{/*section-1*/}
					<div className="flex flex-col justify-start gap-3">
						{/* section-1-1 --profile  */}
						<div className="flex items-center gap-6 ">
							<div>
								<img className="w-20 h-20 rounded-full bg-white"></img>
							</div>
							<div>
								<div className="font-medium text-2xl -mb-1">
									{opDetails?.loan_name}
								</div>
								<div className="font-semibold text-slate-500">
									{companyDetails?.companyName}
								</div>
							</div>
						</div>
						{/* section-1-2 --buttons */}
						<div className="flex justify-around">
							{status.approve ||
							!(status.approve || status.reject || status.unsure) ? (
								<button
									disabled={status.approve}
									onClick={() => vote("2")}
									style={{
										borderColor: "#10B981",
									}}
									className="ml-0 rounded-full h-12 w-[29%]  overflow-hidden border-2 border-[#10B981] btn btn-xs btn-outline text-[#10B981] text-base  capitalize font-medium"
								>
									{status.approve ? "Approved" : "Approve"}
								</button>
							) : null}

							{status.reject ||
							!(status.approve || status.reject || status.unsure) ? (
								<button
									disabled={status.reject}
									onClick={() => vote("1")}
									style={{
										borderColor: "#EF4444",
									}}
									className="rounded-full h-12 w-[29%]  overflow-hidden  border-2 border-[#EF4444] btn btn-xs btn-outline text-[#EF4444] text-base  capitalize font-medium"
								>
									{status.reject ? "Rejected" : "Reject"}
								</button>
							) : null}
							{status.unsure ||
							!(status.approve || status.reject || status.unsure) ? (
								<button
									disabled={status.unsure}
									onClick={() => vote("3")}
									style={{
										borderRadius: "100px",
										padding: "3px 16px",
									}}
									className="mr-0 rounded-full h-12 w-[29%]  overflow-hidden  border-2 border-white btn btn-xs btn-outline text-white text-base  capitalize font-medium"
								>
									Unsure
								</button>
							) : null}
						</div>
						<div className="flex items-center justify-center text-slate-400 font-medium cursor-pointer -mt-3">
							<div>Ask for more details</div>
						</div>
					</div>
					{/* section-2  --Deals overview*/}
					<div className="flex-row justify-between items w-full felx">
						<div className="flex flex-col">
							<div className="flex-row justify-between mt-10 mb-3 flex">
								<div className="mb-0 text-lg font-medium">Deals Overview</div>
							</div>
							<div style={{ color: "#D0D5DD" }}>
								{loanPurpose.isSliced ? (
									<div>
										{loanPurpose.firstText}
										<a
											style={{
												fontWeight: 600,
												cursor: "pointer",
											}}
											onClick={() => setExpand(true)}
										>
											{expand ? null : "... view more"}
										</a>
										{expand ? <div>{loanPurpose.secondText}</div> : null}
										<a
											style={{
												fontWeight: 600,
												cursor: "pointer",
											}}
											onClick={() => setExpand(false)}
										>
											{expand ? "view less" : null}
										</a>
									</div>
								) : (
									<div className="font-light text-lg">
										{loanPurpose.firstText}{" "}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* section-3 --Deal Terms  */}

					<div className="flex-col w-full flex">
						<div className="flex-row justify-between mt-10 mb-3 flex">
							<div className="mb-0 text-lg font-medium">Deals terms</div>
						</div>

						<div className="rounded-box w-auto bg-[#20232A] overflow-hidden border-t-2 border-b-2 border-[#292C33] ">
							<div className="grid grid-cols-2 ">
								{info ? (
									info.map((e, i) => {
										return (
											<div className="justify-center flex flex-col items-center  border-r-2 border-b-2 border-[#292C33] py-10">
												<div className="font-medium text-[#A0ABBB]">
													{e.label}
												</div>
												<div className="font-medium text-xl ">{e.value}</div>
											</div>
										);
									})
								) : (
									<></>
								)}
							</div>
						</div>
					</div>
					{/* collateral  */}
					<div style={{ margin: "20px 0" }}>
						<div
							style={{
								margin: "10px 0",
								marginTop: "40px",
								fontSize: 19,
							}}
						>
							Collateral
						</div>
						<div
							className="w-full"
							style={{
								background: "#20232A",
								borderRadius: "12px",
								padding: "10px",
							}}
						>
							<div style={{ fontSize: "14px", color: "#64748B" }}>
								Name of documents - {opDetails?.collateral_document_name}
							</div>
							<div>Document descripton</div>
							<div style={{ fontSize: 14, color: "#64748B" }}>
								{opDetails?.collateral_document_description}
							</div>
						</div>
					</div>

					<div
						style={{ display: "flex", marginTop: "50px" }}
						className="flex-col w-full"
					>
						<div style={{ marginTop: "40px", fontSize: 19 }}>
							Borrower Details
						</div>
						<div
							style={{ display: "flex" }}
							className="flex-row justify-between mt-5 mb-3"
						>
							<div style={{ fontSize: 16 }} className="mb-0">
								{companyDetails
									? companyDetails.companyName
									: "Name of the Company"}
							</div>
							<div>
								{companyDetails?.twitter ? (
									<button
										id="twitter"
										style={{
											borderRadius: "100px",
											padding: "8px 12px",
											border: "1px solid #64748B",
										}}
										className="ml-3 btn btn-sm btn-outline text-white"
										// onClick={redirectToURl}
									>
										<Twitter />
										<div
											style={{
												marginLeft: 2,
												textTransform: "lowercase",
											}}
										>
											twitter
										</div>
									</button>
								) : (
									<></>
								)}
								{companyDetails?.linkedin ? (
									<button
										id="linkedin"
										style={{
											borderRadius: "100px",
											padding: "8px 12px",
											border: "1px solid #64748B",
										}}
										className="ml-3 btn btn-sm btn-outline text-white"
										//onClick={redirectToURl}
									>
										<LinkedIn />
										<div
											style={{
												marginLeft: 2,
												textTransform: "lowercase",
											}}
										>
											LinkedIn
										</div>
									</button>
								) : (
									<></>
								)}
								{companyDetails?.email ? (
									<button
										id="email"
										style={{
											borderRadius: "100px",
											padding: "8px 12px",
											border: "1px solid #64748B",
										}}
										className="ml-3 btn btn-sm btn-outline text-white"
										//onClick={redirectForEmail}
									>
										<Email />
										<div
											style={{
												marginLeft: 2,
												textTransform: "lowercase",
											}}
										>
											Email
										</div>
									</button>
								) : (
									<></>
								)}
								{companyDetails?.website ? (
									<button
										id="website"
										style={{
											borderRadius: "100px",
											padding: "8px 12px",
											border: "1px solid #64748B",
										}}
										className="ml-3 btn btn-sm btn-outline text-white"
										//onClick={redirectToURl}
									>
										<Website />
										<div
											style={{
												marginLeft: 2,
												textTransform: "lowercase",
											}}
										>
											Website
										</div>
									</button>
								) : (
									<></>
								)}
							</div>
						</div>
						<div style={{ color: "#D0D5DD" }}>
							{companyDetails ? companyDetails.companyBio : ""}
						</div>
					</div>
					{/* <div className="w-1/2">
		<div style={{ margin: "10px 0", marginTop: "40px", fontSize: 19 }}>
		  KYC Details
		</div>
	  </div> */}
					<div className="w-1/2">
						<div
							style={{
								margin: "10px 0",
								marginTop: "40px",
								fontSize: 19,
							}}
						>
							KYB Details
						</div>
						<h6
							style={{
								marginTop: 10,
								marginBottom: 3,
								color: "#64748B",
							}}
						>
							Business Identify Proof
						</h6>
						<DocumentCard
							docName={
								companyDetails
									? companyDetails.businessIdFile.businessIdDocName
									: ""
							}
							docCid={
								companyDetails
									? companyDetails.businessIdFile.businessIdFileCID
									: null
							}
							fileName={
								companyDetails
									? companyDetails.businessIdFile.businessIdFileName
									: null
							}
						/>

						<h6
							style={{
								marginTop: 10,
								marginBottom: 3,
								color: "#64748B",
							}}
						>
							Business Address Proof
						</h6>
						<DocumentCard
							docName={
								companyDetails
									? companyDetails.businessAddFile.businessAddDocName
									: ""
							}
							docCid={
								companyDetails
									? companyDetails.businessAddFile.businessAddFileCID
									: null
							}
							fileName={
								companyDetails
									? companyDetails.businessAddFile.businessAddFileName
									: null
							}
						/>
						<h6
							style={{
								marginTop: 10,
								marginBottom: 3,
								color: "#64748B",
							}}
						>
							Business Incorporation Proof
						</h6>
						<DocumentCard
							docName={
								companyDetails
									? companyDetails.businessIncoFile.businessIncoDocName
									: ""
							}
							docCid={
								companyDetails
									? companyDetails.businessIncoFile.businessIncoFileCID
									: null
							}
							fileName={
								companyDetails
									? companyDetails.businessIncoFile.businessIncoFileName
									: null
							}
						/>
						{companyDetails && companyDetails.businessLicFile ? (
							<>
								<h6
									style={{
										marginTop: 10,
										marginBottom: 3,
										color: "#64748B",
									}}
								>
									Business License Proof
								</h6>
								<DocumentCard
									docName={
										companyDetails
											? companyDetails.businessLicFile.businessLicDocName
											: ""
									}
									docCid={
										companyDetails
											? companyDetails.businessLicFile.businessLicFileCID
											: null
									}
									fileName={
										companyDetails
											? companyDetails.businessLicFile.businessLicFileName
											: null
									}
								/>
							</>
						) : (
							<></>
						)}
					</div>

					<br />
					<br />
					<br />
					<br />
					<br />
				</div>
			</div>
		</div>
	);
};

export default PoolDetails;
