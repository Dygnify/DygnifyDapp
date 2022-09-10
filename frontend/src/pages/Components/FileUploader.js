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
					<span class="text-white">{label}</span>
				</label>
				<div
					style={{
						// outline: "2px solid lightcoral",
						display: "flex",
						padding: "7px 12px",
						borderWidth: 2,
						border: "2px dashed #3A3C43",
						borderRadius: "8px",
					}}
					className=" flex-row bg-[#24272F] items-center overflow-hidden"
				>
					<input
						type="button"
						className="bg-[#30333A]"
						onClick={handleClick}
						style={{
							borderRadius: "37px",
							color: "white",
							padding: "4px 20px",
							cursor: "pointer",
							fontSize: 14,
						}}
						value="Choose file"
					/>
					{/* Choose file
          </button> */}
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
