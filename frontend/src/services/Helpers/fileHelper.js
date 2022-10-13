function getBinaryFileData(fileObj) {
	Sentry.captureMessage("getBinaryFileData", "info");
	try {
		if (fileObj) {
			let read = new FileReader();
			read.readAsBinaryString(fileObj);
			return read;
		}else{
			Sentry.captureMessage("fileObj is not defined", "warning");
		}
	} catch (error) {
		Sentry.captureException(error);
		console.log(error);
	}
}

function getDataURLFromFile(fileObj) {
	Sentry.captureMessage("getDataURLFromFile", "info");
	try {
		if (fileObj) {
			let read = new FileReader();
			read.readAsDataURL(fileObj);
			return read;
		}else{
			Sentry.captureMessage("fileObj is not defined", "warning");
		}
	} catch (error) {
		Sentry.captureException(error);
		console.log(error);
	}
}

module.exports = {
	getBinaryFileData,
	getDataURLFromFile,
};
