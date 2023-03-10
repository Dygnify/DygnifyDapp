import React, { Fragment, useEffect, useState } from "react";
import DummyDataCard from "./DummyDataCard";

const SustainableCard = ({
	name,
	data,
	stainableCheckBoxData,
	setStainableCheckBoxData,
}) => {
	const [updatedData, setUpdatedData] = useState(false);

	//form data
	const [isEditresConProd, setIsEditResConProd] = useState(false);
	const [formData, setformData] = useState({
		title: "",
		value: "",
	});
	const formChangeHandler = (event) => {
		let { name, value } = event.target;
		setformData((prev) => {
			return { ...prev, [name]: value };
		});
	};
	//form data

	const submitHandler = (event) => {
		event.preventDefault();
		setStainableCheckBoxData((prev) => {
			const prevData = prev;
			const newPrevData = prevData.filter((item) => {
				return item.name !== name;
			});
			const deletedPrevData = prevData.filter((item) => {
				return item.name === name;
			});
			let oldData = [];
			if (deletedPrevData.length > 0) {
				oldData = deletedPrevData[0]?.data;
			}
			return [
				...newPrevData,
				{
					name: name,
					data: [...oldData, { ...formData }],
				},
			];
		});
		setformData({
			title: "",
			value: "",
		});
		setIsEditResConProd(false);
	};

	console.log(stainableCheckBoxData, "🥅");

	useEffect(() => {
		const isEmpty = stainableCheckBoxData.filter((item) => {
			return item.name === name;
		});
		if (isEmpty.length === 0) {
			setStainableCheckBoxData((prev) => {
				return [...prev, { name: name, data: data }];
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (stainableCheckBoxData.length > 0) {
			stainableCheckBoxData.forEach((item) => {
				if (item.name === name) {
					setUpdatedData(item);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stainableCheckBoxData]);

	return (
		<Fragment>
			<div>
				<h2 className="text-[1.1875rem] mb-5 ">{name}</h2>
				<div className="w-full dark:bg-[#24272F] mb-5 outline outline-1 outline-offset-0 dark:outline-[#3A3C43] outline-[#BBC0CC] bg-lightmode-200 rounded-lg shadow-md ">
					<ul className="my-4 pt-5 pl-8 pr-8 space-y-3">
						{updatedData &&
							updatedData?.data.map((item) => (
								<DummyDataCard
									name={name}
									title={item.title}
									stainableCheckBoxData={stainableCheckBoxData}
									setStainableCheckBoxData={setStainableCheckBoxData}
									value={item.value}
									data={data}
								/>
							))}
					</ul>

					{!isEditresConProd && (
						<button
							onClick={() => {
								setIsEditResConProd(true);
							}}
							type="button"
							className="py-2.5  ml-[25rem] px-5 mr-7 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
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
								<div className="font-base mr-5">
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
								className="py-2.5  ml-[25rem] px-5 mr-7 mb-4 text-sm font-medium bg-gradient-to-r  from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize  border-none text-white rounded-3xl  focus:outline-[#9281FF]"
							>
								Add more
							</button>
						</form>
					)}
				</div>
			</div>
		</Fragment>
	);
};

export default SustainableCard;
