function getTrimmedString(string, trimLength) {
	if (string) {
		return string.toString().slice(0, trimLength ? trimLength : 10) + "...";
	}
	return null;
}

function getExtendableTextBreakup(text, sliceAt) {
	let isSliced = false;
	let firstText, secondText;
	if (text && sliceAt) {
		let textStr = text.toString();
		if (textStr.length > sliceAt) {
			isSliced = true;
			firstText = textStr.slice(0, sliceAt);
			secondText = textStr.slice(++sliceAt);
		} else {
			firstText = textStr;
		}
	}
	return { isSliced, firstText, secondText };
}

function getOnlyErrorText(str) {
	return str.substring(str.indexOf(":") + 1);
}

function getDisplayAmount(amount) {
	let displayAmt;
	if (amount) {
		amount = parseFloat(amount).toFixed(2);
		if (amount > 999) {
			displayAmt = (amount / 1000).toFixed(2).toString() + "K";
			if (amount > 999999) {
				displayAmt = (amount / 1000000).toFixed(2).toString() + "M";
			}
			if (amount > 99999999) {
				displayAmt = (amount / 100000000).toFixed(2).toString() + "B";
			}
		} else {
			displayAmt = amount;
		}
	}

	return displayAmt;
}

module.exports = {
	getTrimmedString,
	getExtendableTextBreakup,
	getDisplayAmount,
	getOnlyErrorText,
};
