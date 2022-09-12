import React from "react";
const TextField = ({
	label,
	placeholder,
	className,
	name,
	value,
	onChange,
	onBlur,
	error,
	reference,
	text,
}) => {
	return text ? (
		<div className={`${className}`}>
			<label class="label text-lg">
				<span class="text-black dark:text-white text-lg">{label}</span>
			</label>
			<div className="input input-bordered items-center flex justify-between bg-lightmode-200 dark:bg-[#24272F]">
				<input
					onChange={onChange}
					onBlur={onBlur}
					name={name}
					value={value}
					ref={reference}
					type="text"
					placeholder={placeholder}
					className="outline-none w-[80%] appearance-none rounded-lg bg-lightmode-200 dark:bg-[#24272F]"
				/>
				<div className="text-gray-400 font-normal">{text}</div>
			</div>
			{error && (
				<p style={{ color: "red", margin: "0px" }}>
					<small>{error}</small>
				</p>
			)}
		</div>
	) : (
		<div className={`${className}`}>
			<label class="label text-lg">
				<span class="text-black dark:text-white">{label}</span>
			</label>
			<input
				onChange={onChange}
				onBlur={onBlur}
				name={name}
				value={value}
				ref={reference}
				type="text"
				placeholder={placeholder}
				className="input input-bordered w-full bg-lightmode-200 dark:bg-darkmode-800 dark:border-[#3A3C43] border-[#BBC0CC]"
				style={{
					borderWidth: "1px",
					borderRadius: "8px",
				}}
			/>
			{error && (
				<p style={{ color: "red", margin: "0px" }}>
					<small>{error}</small>
				</p>
			)}
		</div>
	);
};

export default TextField;
