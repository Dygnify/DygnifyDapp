import React, { useEffect, useState } from "react";
import { getIPFSFileURL } from "../../services/Helpers/web3storageIPFS";

const DocumentCard = ({ docName, docCid, fileName, disable }) => {
	const viewDoc = () => {
		if (!docCid) return null;
		let url = getIPFSFileURL(docCid);
		if (fileName) url += `/${fileName}`;
		console.log(fileName);
		window.open(url, "_blank");
	};

	return (
		<div className="justify-between mb-2 bg-[#20232A] rounded-lg flex px-4 py-3">
			<div>
				<p>{docName ? null : "view document"}</p>
				{docName ? <p className="italic"> {docName}</p> : null}
			</div>
			<a className="text-blue-700 cursor-pointer" onClick={viewDoc}>
				{disable ? null : "view document"}
			</a>
		</div>
	);
};

export default DocumentCard;
