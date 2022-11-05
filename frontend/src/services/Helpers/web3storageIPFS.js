import { Web3Storage, File } from "web3.storage";
import { Buffer } from "buffer";
const Sentry = require("@sentry/react");
function makeStorageClient() {
	return new Web3Storage({ token: process.env.REACT_APP_WEB3STORAGE_APIKEY });
}

export async function storeFiles(files) {
	Sentry.captureMessage("storeFiles", "info");
	try {
		const client = makeStorageClient();
		const cid = await client.put(files);
		console.log("stored files with cid:", cid);
		return cid;
	} catch (error) {
		Sentry.captureException(error);
		console.log(error);
	}
}

export function makeFileObjects(jsonData, fileName) {
	Sentry.captureMessage("makeFileObjects", "info");
	try {
		if (!jsonData || !fileName) {
			return;
		}
		const buffer = Buffer.from(JSON.stringify(jsonData));
		return [new File([buffer], fileName)];
	} catch (error) {
		Sentry.captureException(error);
		console.log(error);
	}
}

export function getIPFSFileURL(cid) {
	if (!cid) {
		return;
	}

	return `https://w3s.link/ipfs/${cid}`;
}

export async function retrieveFiles(cid, firstFileOnly = true) {
	Sentry.captureMessage("retrieveFiles", "info");
	try {
		if (!cid) {
			return;
		}

		const client = makeStorageClient();
		const res = await client.get(cid);
		console.log(`Got a response! [${res.status}] ${res.statusText}`);
		if (!res.ok) {
			console.log(`failed to get ${cid} - [${res.status}] ${res.statusText}`);
			return;
		}

		// unpack File objects from the response
		const files = await res.files();

		if (firstFileOnly) {
			return files[0];
		}
		return files;
	} catch (error) {
		Sentry.captureException(error);
	}
}
