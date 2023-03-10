import { useFormik } from "formik";
import { useState } from "react";
import GradientButton from "../../../../uiTools/Button/GradientButton";
import SustainableCard from "../../../../uiTools/Card/SustainableCard";
import ArrowLeft from "../../Components/SVG/ArrowLeft";

export default function ImpactMatrix({
	handleNext,
	handlePrev,
	impactData,
	impactData2,
	setImpactData2,
}) {
	const formik = useFormik({
		initialValues: {},
		// validationSchema: CollateralDetailsValidationSchema,
		onSubmit: (values) => {
			handleNext(values, true);
		},
	});

	return (
		<div className="dark:bg-darkmode-800  bg-white w-full mb-8 rounded-2xl mt-20 md:mt-10 px-5">
			<h3 className=" text-[25px]  md:pt-2">Projected Impact</h3>
			<br />

			{impactData?.map((item, index) => (
				<SustainableCard
					key={index}
					name={item.name}
					data={item.data}
					stainableCheckBoxData={impactData2}
					setStainableCheckBoxData={setImpactData2}
				/>
			))}

			

			<form onSubmit={formik.handleSubmit}>
				<div className=" flex flex-col-reverse gap-5 py-5 md:my-0 md:-mb-14  justify-center items-center md:flex-row md:justify-around pb-10">
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
			</form>
		</div>
	);
}
