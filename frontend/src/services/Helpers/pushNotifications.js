import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const PK = process.env.REACT_APP_PRIVATE_KEY;
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

export const sendNotification = async (address, title, body) => {
	console.log("Insiade sendNotification");
	try {
		const apiResponse = await PushAPI.payloads.sendNotification({
			signer,
			type: 3, // target
			identityType: 2, // direct payload
			notification: {
				title: title,
				body: body,
			},
			payload: {
				title: title,
				body: body,
				cta: "",
				img: "",
			},
			recipients: `eip155:80001:${address}`, // recipient address
			channel: "eip155:80001:0x23Db9F9731BCFb35CAc11B2e8373ACD14318bDF5",
			env: "staging",
		});

		// apiResponse?.status === 204, if sent successfully!
		console.log("API repsonse: ", apiResponse);
	} catch (err) {
		console.error("Error: ", err);
	}
};
