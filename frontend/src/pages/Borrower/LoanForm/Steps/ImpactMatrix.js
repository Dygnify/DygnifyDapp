import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import GradientButton from "../../../../uiTools/Button/GradientButton";
import TextField from "../../../../uiTools/Inputs/TextField";
import { CollateralDetailsValidationSchema } from "../validations/validation";
import ArrowLeft from "../../Components/SVG/ArrowLeft";

export default function ImpactMatrix({
	handleNext,
	handlePrev,
	formData,
	brJson,
}) {
	// const [totalImpacts, setTotalImpacts] = useState([
	// 	{
	// 		label: brJson?.checkBoxData?.affordableData.label1,
	// 		id: 1,
	// 		value: brJson?.checkBoxData.affordableData.value1,
	// 	},
	// ]);
	// const [totalImpacts2, setTotalImpacts2] = useState([
	// 	{
	// 		label: brJson?.checkBoxData?.affordableData.label2,
	// 		id: 1,
	// 		value: brJson?.checkBoxData?.affordableData?.value2,
	// 	},
	// ]);

	const [addNewFeild, setAddNewFeild] = useState(false);
	const [addNewFeild2, setAddNewFeild2] = useState(false);

	const [checkedData, setcheckedData] = useState("");
	const [climateState, setClimateState] = useState(false);
	const [affordableState, setAffordableState] = useState(false);

	// const formik = useFormik({
	// 	initialValues: {
	// 		impact_criteria_name: `${
	// 			formData.impact_criteria_name ? formData.impact_criteria_name : ""
	// 		}`,
	// 		impact_criteria_value: `${
	// 			formData.impact_criteria_value ? formData.impact_criteria_value : ""
	// 		}`,
	// 	},
	// 	validationSchema: CollateralDetailsValidationSchema,
	// 	onSubmit: (values) => {
	// 		console.log("Impact Matrix: ", values);
	// 		console.log("Impact Matrix2: ", formik.values);
	// 		console.log("Impact Matrix3: ", formData);
	// 		handleNext(values, true);
	// 	},
	// });

	// const handleAddImpact = () => {
	// 	const len = totalImpacts.length;
	// 	const newInfo = {
	// 		label: `this is dummy text to test${len + 1}`,
	// 		id: len + 1,
	// 	};
	// 	setTotalImpacts([...totalImpacts, newInfo]);
	// };
	// const handleAddImpact2 = () => {
	// 	const len = totalImpacts2.length;
	// 	const newInfo = {
	// 		label: `this is dummy text to test${len + 1}`,
	// 		id: len + 1,
	// 	};
	// 	setTotalImpacts2([...totalImpacts2, newInfo]);
	// };

	// const inputRef = useRef();

	// useEffect(() => {
	// 	inputRef.current.focus();
	// }, []);

	return (
		<div className="dark:bg-darkmode-800  bg-white w-full mb-8 rounded-2xl mt-20 md:mt-10 px-5">
			<h3 className=" text-[25px]  md:pt-2">Projected Impact</h3>
			<br />
			<h4 className="mb-1 text-sm">SDG Goal 1</h4>

			{true && (
				<>
					<div class="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
						<ul class="my-4 pt-4 pl-8 pr-8 space-y-3">
							<li className="flex justify-between items-center">
								<div className="font-base">
									<span class="flex-1  whitespace-nowrap">
										Metric tonnes of Co2 reduced
									</span>
								</div>
								<div>
									<input
										type="text"
										// onChange={(e) => {
										// 	console.log(e.target.value);
										// 	setAffordableData({
										// 		label1: "Metric tonnes of Co2 reduced",
										// 		value1: e.target.value,
										// 		label2: "MW increase in RW generation",
										// 		value2: affordableData.value2,
										// 	});
										// 	console.log(affordableData);
										// }}
										placeholder="Enter value"
										className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[15rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
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
										// onChange={(e) => {
										// 	console.log(e.target.value);
										// 	setAffordableData({
										// 		label1: "Metric tonnes of Co2 reduced",
										// 		value1: affordableData.value1,
										// 		label2: "MW increase in RW generation",
										// 		value2: e.target.value,
										// 	});
										// 	console.log(affordableData);
										// }}
										placeholder="Enter value"
										className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[15rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
									/>
								</div>
							</li>
						</ul>

						<button
							onClick={() => {
								// setAddNewFeild((prev) => !prev);
							}}
							type="button"
							class="py-2.5  ml-[32rem] px-5 mr-2 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
						>
							Add more
						</button>

						{false && (
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
				</>
			)}

			{/* <div className="my-gradient px-4 py-2 flex flex-col gap-5 rounded-xl w-full">
				{totalImpacts.map((info, index) => (
					<div
						key={index}
						className="justify-between items-center md:flex  md:gap-3 mb-2"
					>
						<p className="text-[17px]">{info.label}</p>
						<TextField
							name="impact_criteria_name"
							value={formik.values.impact_criteria_name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							reference={inputRef}
							error={
								formik.touched.impact_criteria_name &&
								formik.errors.impact_criteria_name
									? formik.errors.impact_criteria_name
									: null
							}
							label=""
							placeholder="Enter Impact Criteria Name"
							className="w-full md:w-1/2 md:mr-2 md:mb-0 -mt-3"
						></TextField>
					</div>
				))}
				<div className="flex justify-end mr-2 -mt-2">
					<small
						type="button"
						onClick={() => {
							handleAddImpact();
						}}
						className="bg-[#16171d] cursor-pointer text-slate-400 hover:text-slate-300 hover:outline-1 text-sm font-thin py-1 px-2 rounded-full"
					>
						Add Impact
					</small>
				</div>
			</div> */}
			<br />
			<br />
			<h4 className="mb-1 text-sm">SDG Goal 2</h4>

			{true && (
				<>
					<h2 className="text-[1.1875rem] mb-5 ">Climate Action</h2>

					<div class="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
						<ul class="my-4 pt-4 pl-8 pr-8 space-y-3">
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
											// setClimateData({
											// 	label1: "Metric tonnes of Co2 reduced",
											// 	value1: e.target.value,
											// 	label2: "MW increase in RW generation",
											// 	value2: climateData.value2,
											// });
											// console.log(climateData);
										}}
										placeholder="Enter value"
										className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[15rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
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
											// setClimateData({
											// 	label1: "Metric tonnes of Co2 reduced",
											// 	value1: climateData.value1,
											// 	label2: "MW increase in RW generation",
											// 	value2: e.target.value,
											// });
											// console.log(climateData);
										}}
										placeholder="Enter value"
										className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[15rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
									/>
								</div>
							</li>
						</ul>

						<button
							onClick={() => {
								// setAddNewFeild2((prev) => !prev);
							}}
							type="button"
							class="py-2.5  ml-[32rem] px-5 mr-2 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
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
				</>
			)}

			{/* <div className="my-gradient px-4 py-2 flex flex-col gap-5 rounded-xl w-full">
				{totalImpacts2.map((info, index) => (
					<div
						key={index}
						className="justify-between items-center md:flex  md:gap-3 mb-2"
					>
						<p className="text-[17px]">{info.label}</p>
						<TextField
							name="impact_criteria_name"
							value={formik.values.impact_criteria_name}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							reference={inputRef}
							error={
								formik.touched.impact_criteria_name &&
								formik.errors.impact_criteria_name
									? formik.errors.impact_criteria_name
									: null
							}
							label=""
							placeholder="Enter Impact Criteria Name"
							className="w-full md:w-1/2 md:mr-2 md:mb-0 -mt-3"
						></TextField>
					</div>
				))}
				<div className="flex justify-end mr-2 -mt-2">
					<small
						type="button"
						onClick={() => {
							handleAddImpact2();
						}}
						className="bg-[#16171d] cursor-pointer text-slate-400 hover:text-slate-300 hover:outline-1 text-sm font-thin py-1 px-2 rounded-full"
					>
						Add Impact
					</small>
				</div>
			</div> */}
			{/* <form onSubmit={formik.handleSubmit}>
				<div className=" flex flex-col-reverse gap-5 py-5 md:my-0 md:-mb-14 pt-10 justify-center items-center md:flex-row md:justify-around pb-10">
					<div className="">
						<label
							onClick={() => {
								handlePrev(formik.values, false);
							}}
							className="text-gray-500 md:pl-28 flex-row cursor-pointerm ml-1 flex"
						>
							<ArrowLeft color="#64748B" />
							Back
						</label>
					</div>
					<div className="md:pr-24 lg:pr-10 xl:pr-0">
						<GradientButton type="submit">Next</GradientButton>
					</div>
				</div>
			</form> */}
		</div>
	);
}
