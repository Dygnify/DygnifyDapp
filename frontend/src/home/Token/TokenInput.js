import React, { useEffect, useState } from "react";

const TokenInput = ({ placeholder, onChange }) => {
	const [isDark, setIsDark] = useState(localStorage.getItem("dark-mode"));
	
	useEffect(() => {
		setIsDark(localStorage.getItem("dark-mode"));
		console.log('dark-mode in useEffect: ', isDark);
	}, [localStorage.getItem("dark-mode")]);

	const [tokenInputOutline, setTokenInputOutline] = useState(false);

	return (
		<div
			className={`input input-bordered dark:border-transparent border-neutral-300 items-center flex justify-between bg-lightmode-200 dark:bg-[#24272F] 
			
			${
				tokenInputOutline
					? "outline outline-2 outline-offset-2 dark:outline-[#3A3C43] outline-[#E7EAEE] "
					: ""
			}`}
		>
			<input
				onChange={onChange}
				onFocus={() => {
					setTokenInputOutline(tokenInputOutline ? false : true);
				}}
				onBlur={() =>
					setTokenInputOutline(tokenInputOutline ? false : true)
				}
				type="text"
				placeholder={placeholder}
				className="outline-none w-[256px] appearance-none rounded-lg bg-lightmode-200 dark:bg-[#24272F]"
			/>
		</div>
	);
};

export default TokenInput;
