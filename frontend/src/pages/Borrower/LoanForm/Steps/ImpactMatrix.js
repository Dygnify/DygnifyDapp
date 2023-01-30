import { useFormik } from "formik";
import GradientButton from "../../../../uiTools/Button/GradientButton";
import ArrowLeft from "../../Components/SVG/ArrowLeft";

export default function ImpactMatrix({
	handleNext,
	handlePrev,
	impactData,
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
				<div key={index}>
					<h2 className="text-[1.1875rem] mb-5 ">{item?.name}</h2>

					<div class="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
						<ul class="my-4 pt-4 pl-8 pr-8 space-y-3">
							{item?.data.map((dt, i) => (
								<li
									key={i}
									className="flex justify-between items-center"
								>
									<div className="font-base">
										<span class="flex-1  whitespace-nowrap">
											{dt?.title}
										</span>
									</div>
									<div>
										<input
											type="text"
											onChange={(e) => {
												impactData[index].data[
													i
												].value = e.target.value;
											}}
											defaultValue={`${impactData[index].data[i].value}`}
											placeholder="Enter value"
											className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-[15rem] p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
										/>
									</div>
								</li>
							))}
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
					</div>
				</div>
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
