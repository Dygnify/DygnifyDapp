import React, { useState } from "react";

const FileUploader = ({
	name,
	label,
	className,
	onBlur,
	error,
	handleFile,
	fileName,
}) => {
	const hiddenFileInput = React.useRef(null);

	const [fileUploadedName, setFileUploadedName] = useState();

	const handleClick = (event) => {
		hiddenFileInput.current.click();
	};
	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		setFileUploadedName(fileUploaded.name);

		handleFile(event.target.files);
	};
	return (
		<>
			<div className={`${className}`}>
				<label class="label" style={{ marginBottom: 1 }}>
					<span class="text-black dark:text-white">{label}</span>
				</label>
				<div
					style={{
						// outline: "2px solid lightcoral",
						display: "flex",
						padding: "6px 4px",
						borderWidth: 2,
						border: "1px dashed #3A3C43",
						borderRadius: "8px",
					}}
					className=" flex-row bg-lightmode-200 dark:bg-[#24272F] items-center overflow-hidden"
				>
					<input
						type="button"
						className="bg-lightmode-300 dark:bg-[#30333A] text-black"
						onClick={handleClick}
						style={{
							borderRadius: "37px",
							color: "white",
							padding: "5px 20px",
							cursor: "pointer",
							fontSize: 14,
						}}
						value="Choose file"
					/>

					<div
						style={{
							marginInline: "0.5em",
							color: "#c7cad1",
							fontStyle: "italic",
						}}
					>
						{fileUploadedName ? fileUploadedName : fileName}
					</div>
				</div>
				<input
					type="file"
					name={name}
					onBlur={onBlur}
					ref={hiddenFileInput}
					onChange={handleChange}
					style={{ display: "none" }}
				/>
				{error && (
					<p style={{ color: "red", margin: "0px" }}>
						<small>{error}</small>
					</p>
				)}
			</div>
		</>
	);
};
export default FileUploader;
