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
			<label class="label">
				<span class="text-white">{label}</span>
			</label>
			<div className="input input-bordered items-center flex justify-between bg-[#24272F]">
				<input
					onChange={onChange}
					onBlur={onBlur}
					name={name}
					value={value}
					ref={reference}
					type="text"
					placeholder={placeholder}
					className="outline-none w-[80%] appearance-none rounded-lg bg-[#24272F]"
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
			<label class="label">
				<span class="text-white">{label}</span>
			</label>
			<input
				onChange={onChange}
				onBlur={onBlur}
				name={name}
				value={value}
				ref={reference}
				type="text"
				placeholder={placeholder}
				className="input input-bordered w-full"
				style={{
					backgroundColor: "#24272F",
					border: "2px solid #3A3C43",
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
