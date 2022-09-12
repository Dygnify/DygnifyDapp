import React from "react";
import FileUploader from "../../pages/Components/FileUploader";
import FileFields from "./FileFields";
import TextField from "./TextField";

const InputGroup = ({
	caption,
	name,
	value,
	error,
	onChangeText,
	onChange,
	onBlur,
	fileName,
	reference,
}) => {
	return (
		<div
			className="bg-lightmode-300 dark:bg-darkmode-800  w-full px-4 pb-4 mb-2"
			style={{ borderRadius: "17px" }}
		>
			<h2 className="pt-2">{caption}</h2>
			<div className="justify-between" style={{ display: "flex" }}>
				<TextField
					label="Document Name"
					placeholder="Enter Document Name"
					className="w-1/2 mr-4"
					name={name}
					value={value}
					error={error}
					onChange={onChangeText}
					onBlur={onBlur}
					reference={reference}
				/>

				<FileUploader
					label="Upload Document"
					className="w-1/2 ml-4"
					handleFile={onChange}
					fileName={fileName}
				/>
			</div>
		</div>
	);
};

export default InputGroup;
