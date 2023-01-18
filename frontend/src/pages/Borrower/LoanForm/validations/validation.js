import * as Yup from "yup";

export const loanDetailsValidationSchema = Yup.object().shape({
	loan_name: Yup.string().label("Loan Name").required(),
	loan_type: Yup.mixed().label("Loan Type").required(),
	loan_purpose: Yup.string().label("Loan Purpose").required(),
	loan_amount: Yup.number().positive().label("Loan Amount").required(),
	loan_tenure: Yup.number()
		.positive()
		.integer()
		.min(1)
		.max(100)
		.required()

		.label("Loan Tenure"),
	loan_interest: Yup.number()
		.positive()
		.min(1)
		.max(100)
		.required()

		.label("Loan Interest"),
	payment_frequency: Yup.number()
		.positive()
		.min(1)

		.label("Payment Frequency")
		.required(),
});

const SUPPORTED_FORMATS = [
	"image/jpg",
	"image/jpeg",
	"image/png",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const CollateralDetailsValidationSchema = Yup.object().shape({
	collateral_document_name: Yup.string().label("Document Name").required(),
	collateral_document_description: Yup.string()
		.label("Document Description")
		.required(),
	collateral_document: Yup.mixed().required(),
	capital_loss: Yup.number()
		.positive()
		.min(0)
		.max(100)
		.label("First loss capital"),
});
