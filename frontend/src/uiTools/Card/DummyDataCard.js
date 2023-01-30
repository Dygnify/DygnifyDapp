import React, { useEffect, useState } from "react";

const DummyDataCard = ({
	name,
	value,
	title,
	setStainableCheckBoxData,
	data,
}) => {
	const [isAbleDelete, setIsAbleDelete] = useState(false);

	const DummyDataValue = (e) => {
		const value = e.target.value;
		setStainableCheckBoxData((prev) => {
			const prevData = prev;
			const newPrevData = prevData.filter((item) => {
				return item.name !== name;
			});
			const deletedPrevData = prevData.filter((item) => {
				return item.name === name;
			});
			let updatedData = [];
			deletedPrevData[0]?.data.forEach((item) => {
				if (item.title === title) {
					updatedData.push({ title: title, value: value });
				} else {
					updatedData.push(item);
				}
			});
			return [
				...newPrevData,
				{
					name: name,
					data: [...updatedData],
				},
			];
		});
	};

	useEffect(() => {
		if (data.length > 0) {
			data.forEach((item) => {
				if (item.title === title) {
					setIsAbleDelete(true);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteHandler = () => {
		setStainableCheckBoxData((prev) => {
			const prevData = prev;
			const newPrevData = prevData.filter((item) => {
				return item.name !== name;
			});
			const deletedPrevData = prevData.filter((item) => {
				return item.name === name;
			});

			let updatedDataAfterDelete = deletedPrevData[0]?.data.filter((item) => {
				return item.title !== title;
			});
			console.log(updatedDataAfterDelete, "😎");

			return [
				...newPrevData,
				{
					name: name,
					data: [...updatedDataAfterDelete],
				},
			];
		});
	};

	return (
		<>
			<li className="flex justify-between items-center">
				<div className="font-base">
					<span className="flex-1  whitespace-nowrap">{title}</span>
				</div>
				<div className="flex gap-2">
					<input
						type="text"
						value={value}
						onChange={DummyDataValue}
						placeholder="Enter value"
						className="border text-black dark:text-white  text-sm rounded-lg  border-[#BBC0CC] block w-full p-2.5 dark:bg-[#24272F] dark:border-gray-600 outline-none"
					/>

					<button
						onClick={deleteHandler}
						className={`${isAbleDelete ? "invisible" : ""}`}
					>
						✕
					</button>
				</div>
			</li>
		</>
	);
};

export default DummyDataCard;
