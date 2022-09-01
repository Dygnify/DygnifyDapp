import ArrowLeft from "../../Components/SVG/ArrowLeft";
import { useState } from "react";

export default function Final({ handlePrev, finalSubmit, formData }) {
	const [checked, setChecked] = useState(false);

	const handleClick = () => {
		finalSubmit(formData);
	};

	console.log("clicked...", formData);

	return (
		<div style={{ display: "flex" }} className="flex-col gap-4">
			<div style={{ display: "flex" }} className="flex-col gap-3">
				<div className="">
					<h4
						className="text-primary
				font-bold
				text-lg
				2xl:text-xl
				mb-2"
						style={{ color: "#9281FF" }}
					>
						Loan Details
					</h4>

					<div style={{ display: "flex" }} className="w-full">
						<div
							style={{ display: "flex" }}
							className="flex-col gap-1 w-[55%] xl:w-[60%] 2xl:w-[65%]"
						>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "7rem 1fr",
								}}
								className="font-[500] text-base"
							>
								<span className=" text-[#A0ABBB]">Pool Name</span>
								<span className="text-[#fff]">{formData.loan_name}</span>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "7rem 1fr",
								}}
								className="font-[500] text-base"
							>
								<span className=" text-[#A0ABBB]">Loan Tenure</span>
								<span className="text-[#fff]">{formData.loan_tenure}</span>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "7rem 1fr",
								}}
								className="font-[500] text-base"
							>
								<span className=" text-[#A0ABBB]">Loan Interest</span>
								<span className="text-[#fff]">{formData.loan_interest}</span>
							</div>
						</div>

						<div
							style={{ display: "flex" }}
							className="flex-col gap-1 w-[45%] xl:w-[40%] 2xl:w-[35%] "
						>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
								}}
								className="font-[500] text-base w-full"
							>
								<span className=" text-[#A0ABBB]">Loan amount</span>
								<span className="text-[#fff] text-right">
									{formData.loan_amount}
								</span>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "10rem 1fr",
								}}
								className="font-[500] text-base"
							>
								<span className=" text-[#A0ABBB]">Repayment frequency</span>
								<span className="text-[#fff] text-right">
									{formData.payment_frequency}
								</span>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
								}}
								className="font-[500] text-base"
							>
								<p className="font-[500] text-[#A0ABBB]">Loan Type</p>

								<span className="text-[#fff] text-right">
									{formData.loan_type == 1 ? "Term Loan" : "Bullet Loan"}
								</span>
							</div>
						</div>
					</div>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "7rem 1fr",
						}}
						className="font-[500] text-base mt-[0.5rem]"
					>
						<span className="text-[#A0ABBB]">Loan Purpose</span>
						<span className="text-[#fff]">{formData.loan_purpose}</span>
					</div>
				</div>

				<div className="">
					<h4
						className="text-primary font-[500] text-xl mb-2"
						style={{ color: "#9281FF" }}
					>
						Collateral
					</h4>

					<div
						style={{ display: "flex" }}
						className="flex-col gap-2 justify-between mb-3"
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "14rem 1fr",
							}}
							className="font-[500] text-base grid-cols-2"
						>
							<span className=" text-[#A0ABBB]">Collateral document Name</span>
							<span className="text-[#fff]">
								{formData.collateral_document_name}
							</span>
						</div>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "14rem 1fr",
							}}
							className="font-[500] text-base grid-cols-2"
						>
							<span className=" text-[#A0ABBB]">Collateral File</span>
							<span className="text-[#fff]">
								{formData.collateral_document[0]?.name}
							</span>
						</div>
					</div>

					<div
						style={{ display: "flex" }}
						className="flex-col font-[500] text-base mt-[0.1rem]"
					>
						<span className="text-[#A0ABBB]">
							Collateral Document Description{" "}
						</span>
						<span className="text-[#fff]">
							{formData.collateral_document_description}
						</span>
					</div>
				</div>
			</div>
			<div className="text-center">
				<input
					type="checkbox"
					checked={checked}
					onChange={() => {
						setChecked((prev) => !prev);
					}}
					id="terms"
				/>
				&nbsp;
				<label htmlFor="terms"> I agree to all </label>
				<a
					onClick={() => {
						window.open("https://www.dygnify.com/privacy-policy", "_blank");
					}}
					className="font-extralight text-sm underline decoration-1 underline-offset-1 cursor-pointer"
				>
					terms and condition
				</a>
			</div>

			<div
				style={{ display: "flex" }}
				className="flex-row justify-between w-full items-center content-center"
			>
				<div
					style={{ display: "flex" }}
					className="justify-center flex-row w-1/3 ml-10"
				>
					<label
						onClick={handlePrev}
						className="text-gray-500 flex-row"
						style={{
							cursor: "pointer",
							marginLeft: 5,
							display: "flex",
						}}
					>
						<ArrowLeft color="#64748B" />
						Back
					</label>
				</div>

				<button
					// typeof="submit"
					// htmlFor="ProcessModal"
					onClick={handleClick}
					style={{
						borderRadius: "100px",
						padding: "12px 24px",
						color: "white",
					}}
					className={`btn btn-wide  capitalize font-medium border-none  
					bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF]
					disabled:opacity-40
							
					`}
					disabled={!checked}
				>
					Submit
				</button>
			</div>

			<div style={{ display: "flex" }} className=" justify-center">
				<div
					style={{
						fontWeight: 600,
						fontSize: "14px",
						color: "#FBBF24",
					}}
				>
					Note - This pool created will only be valid for 60 days from the day
					after verification{" "}
				</div>
			</div>
		</div>
	);
}
