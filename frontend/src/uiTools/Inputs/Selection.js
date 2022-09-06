import React, { useState } from "react";
import Select from "react-select";

const customStyles = {
	control: (base, state) => ({
		...base,
		background: "#24272F",
		borderColor: "none",
		border: "none",
		marginLeft: "-0.70rem",
		boxShadow: state.isFocused ? null : null,
	}),
	menu: (provided, state) => ({
		...provided,
		background: "#24272F",
		// borderBottom: "none",
		color: "white",
		fontSize: 16,
		borderRadius: "0.5rem",
		paddingTop: 0,
		paddingBottom: 0,
		overflow: "hidden",
	}),
	singleValue: (provided, state) => {
		const color = "white";
		const fontSize = 15;
		return { ...provided, color, fontSize };
	},
	placeholder: (defaultStyles) => {
		return {
			...defaultStyles,
			color: "#A0ABBB",
		};
	},
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		return {
			...styles,
			backgroundColor: isFocused ? "#6047FF" : null,
			paddingTop: 0,
			paddingBottom: 0,
			":active": {
				backgroundColor: "none",
			},
		};
	},
	menuList: (provided, state) => ({
		...provided,
		paddingTop: 0,
		paddingBottom: 0,
	}),
};

const Selection = ({ onChange, value, placeholder, options }) => {
	const defaultValue = (options, value) => {
		return options ? options.find((options) => options.value == value) : "";
	};

	return (
		<Select
			className=" w-[80%] appearance-none rounded-lg bg-[#24272F] text-black active:bg-[#24272F]"
			placeholder={placeholder}
			value={defaultValue(options, value)}
			openMenuOnFocus={true}
			styles={customStyles}
			onChange={(value) => onChange(value)}
			options={options}
		/>
	);
};

export default Selection;
