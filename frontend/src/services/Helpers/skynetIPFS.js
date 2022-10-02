import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import { captureException } from "@sentry/react";

// Set an upload progress tracker.
export function onUploadProgress(progress, { loaded, total }) {
	console.info(`Progress ${Math.round(progress * 100)}%`);
}

const client = new SkynetClient("https://siasky.net", {
	onUploadProgress,
	skynetApiKey: process.env.REACT_APP_SKYNET_APIKEY,
});
const { privateKey, publicKey } = genKeyPairFromSeed(
	process.env.REACT_APP_SKYNET_SEED_PHRASE
);

export async function uploadFile(file) {
	if (file) {
		try {
			const { skylink } = await client.uploadFile(file);
			console.log(`Upload successful, skylink: ${skylink}`);
			return skylink;
		} catch (error) {
			captureException(error);
		}
	}
}

export async function openFileInNewTab(skylink) {
	if (skylink) {
		try {
			await client.openFile(skylink);
		} catch (error) {
			captureException(error);
		}
	}
}

export async function getFileUrl(skylink) {
	if (skylink) {
		try {
			return await client.getSkylinkUrl(skylink);
		} catch (error) {
			captureException(error);
		}
	}
}

export async function storeJSONData(dataKey, jsonData) {
	if (dataKey && jsonData) {
		try {
			await client.db.setJSON(privateKey, dataKey, jsonData);
		} catch (error) {
			captureException(error);
		}
	}
}

export async function getJSONData(dataKey) {
	if (dataKey) {
		try {
			const { data } = await client.db.getJSON(publicKey, dataKey);
			return data;
		} catch (error) {
			captureException(error);
		}
	}
}
