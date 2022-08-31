import { useFormik } from "formik";
import GradientButton from "../../../../uiTools/Button/GradientButton";
import TextArea from "../../../../uiTools/Inputs/TextArea";
import TextField from "../../../../uiTools/Inputs/TextField";
import { loanDetailsValidationSchema } from "../../../LoanForm/validations/validation";

export default function Account({ formData, handleNext, handleForm }) {
	const formik = useFormik({
		initialValues: formData,
		validationSchema: loanDetailsValidationSchema,
		onSubmit: (values, { resetForm }) => {
			console.log("clicked.", values);
			handleNext(values, false);
		},
	});

	return (
		<>
			<div style={{ display: "flex" }} className="flex-col ">
				<form onSubmit={formik.handleSubmit}>
					<div style={{ display: "flex" }}>
						<TextField
							name="loan_name"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							className="w-1/2 mr-2"
							label="Pool Name"
							placeholder="Enter Pool Name"
							value={formik.values.loan_name}
							error={
								formik.touched.loan_name && formik.errors.loan_name
									? formik.errors.loan_name
									: null
							}
						></TextField>
						<TextField
							name="loan_amount"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.loan_amount && formik.errors.loan_amount
									? formik.errors.loan_amount
									: null
							}
							className="w-1/2 ml-2"
							label="Loan Amount"
							placeholder="Enter Loan Amount in USDC"
							value={formik.values.loan_amount}
						></TextField>
					</div>
					<div style={{ display: "flex" }}>
						{/* <TextField
							name="loan_tenure"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.loan_tenure && formik.errors.loan_tenure
									? formik.errors.loan_tenure
									: null
							}
							className="w-1/2 mr-2"
							label="Loan Tenure"
							placeholder="Enter Loan Tenure in Months"
						></TextField> */}
						<div className="w-1/2 mr-2">
							<label class="label">
								<span class="text-white">Loan Tenure</span>
							</label>
							<div className="input input-bordered items-center flex justify-between bg-[#24272F]">
								<select
									name="loan_tenure"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="outline-none w-[80%] appearance-none rounded-lg bg-[#24272F]"
									// placeholder="Enter Loan Tenure in Months"
									// defaultValue={"0"}
									value={formik.values.loan_tenure}
								>
									<option className="hidden">Enter Loan Tenure</option>
									<option value="6" className="pb-5">
										06
									</option>
									<option value="12">12</option>
									<option value="18">18</option>
									<option value="24">24</option>
									<option value="30">30</option>
									<option value="36">36</option>
								</select>

								<div className="text-gray-400">Months</div>
							</div>
							{formik.touched.loan_tenure && formik.errors.loan_tenure ? (
								<p style={{ color: "red" }}>
									<small>{formik.errors.loan_tenure}</small>
								</p>
							) : null}
						</div>
						{/* <TextField
							name="payment_frequency"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.payment_frequency &&
								formik.errors.payment_frequency
									? formik.errors.payment_frequency
									: null
							}
							className="w-1/2 ml-2"
							label="Repayment Frequency"
							placeholder="Enter Repayment Frequency in Days"
							value={formik.values.payment_frequency}
						></TextField> */}
						<div className="w-1/2 ml-2">
							<label class="label">
								<span class="text-white">Repayment Frequency</span>
							</label>
							<div className="input input-bordered items-center flex justify-between bg-[#24272F]">
								<select
									name="payment_frequency"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className="outline-none w-[80%] appearance-none rounded-lg bg-[#24272F]"
									// placeholder="Enter Repayment Frequency in Days"
									// defaultValue={"0"}
									value={formik.values.payment_frequency}
								>
									<option className="hidden">Enter Repayment</option>
									<option value="30">30</option>
									<option value="60">60</option>
									<option value="90">90</option>
								</select>
								<div className="text-gray-400">Days</div>
							</div>
							{formik.touched.payment_frequency &&
							formik.errors.payment_frequency ? (
								<p style={{ color: "red" }}>
									<small>{formik.errors.payment_frequency}</small>
								</p>
							) : null}
						</div>
					</div>
					<div style={{ display: "flex" }}>
						<TextField
							name="loan_interest"
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							error={
								formik.touched.loan_interest && formik.errors.loan_interest
									? formik.errors.loan_interest
									: null
							}
							className="w-1/2 mr-2"
							label="Loan Interest"
							placeholder="Enter Loan Interest Percentage"
							value={formik.values.loan_interest}
						></TextField>
						<div className="w-1/2 ml-2">
							<label class="label">
								<span class="text-white">Loan Type</span>
							</label>
							<select
								className="input input-bordered w-full"
								style={{
									backgroundColor: "#24272F",
									border: "2px solid #3A3C43",
									borderRadius: "8px",
								}}
								name="loan_type"
								defaultValue={"0"}
								value={formik.values.loan_type}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.loan_type && formik.errors.loan_type
										? formik.errors.loan_type
										: null
								}
							>
								<option value="0" className="text-base">Term Loan</option>
								<option value="1" className="text-base">Bullet Loan</option>
							</select>

							{formik.touched.loan_type && formik.errors.loan_type ? (
								<p style={{ color: "red" }}>
									<small>{formik.errors.loan_type}</small>
								</p>
							) : null}
						</div>
					</div>
					<TextArea
						name="loan_purpose"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={
							formik.touched.loan_purpose && formik.errors.loan_purpose
								? formik.errors.loan_purpose
								: null
						}
						className="w-full"
						label="Loan Purpose"
						placeholder="Short Summary on Purpose of Loans"
						value={formik.values.loan_purpose}
					></TextArea>

					<div
						style={{ display: "flex", marginTop: 20 }}
						className="flex-row justify-between w-full items-center content-center "
					>
						<div
							style={{ display: "flex" }}
							className="justify-center flex-row w-1/3"
						>
							<label
								onClick={handleForm}
								style={{
									cursor: "pointer",
									marginLeft: 5,
									display: "flex",
									marginLeft: 50,
								}}
							>
								Cancel
							</label>
						</div>
						<GradientButton type="submit">Next</GradientButton>
					</div>
				</form>
			</div>
		</>
	);
}
