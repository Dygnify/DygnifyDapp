import { useEffect, useState } from "react";

function FileUpload({ fileName, progress, status }) {
	const [color, setColor] = useState("text-warning-500");

	useEffect(() => {
		let warningColor = "text-warning-500";
		let success = "text-success-500";

		if (status === "uploading" || status === "pending") {
			setColor(warningColor);
		} else {
			setColor(success);
		}
	}, [status]);

	return (
		<div className=" rounded-md bg-darkmode-50">
			<div className="flex justify-between p-3">
				<p>
					File Name: <span className="underline">{fileName}</span>
				</p>

				<p>
					Status: <span className={color}>{status}</span>
				</p>
			</div>

			<div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 ">
				<div
					className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none max-w-[100%]`}
					style={{
						width: `${progress}%`,
						transition: "width 0.3s ease-out",
						borderRadius: `0 0 ${progress < 100 ? "0" : "0.5em"} 0.5em`,
					}}
				>
					{progress}%
				</div>
			</div>
		</div>
	);
}

export default FileUpload;
