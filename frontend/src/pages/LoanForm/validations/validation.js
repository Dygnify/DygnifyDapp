import * as Yup from 'yup'

export const loanDetailsValidationSchema = Yup.object().shape({
    loan_type: Yup.mixed().required().label('Loan Type'),
    loan_purpose: Yup.string().required().label('Loan Purpose'),
    loan_amount: Yup.number().positive().required().label('Loan Amount'),
    loan_tenure: Yup.number().positive().integer().min(1).max(100).required().label('Loan Tenure'),
    loan_interest: Yup.number().positive().min(0).max(100).required().label('Loan Interest'),
    payment_frequency: Yup.number().positive().min(1).required().label('Payment Frequency')
})

const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export const CollateralDetailsValidationSchema = Yup.object().shape({
    collateral_document: Yup
        .mixed()
        .required("A file is required")
        .test(
            "fileFormat",
            "Unsupported Format, Supported Formats: jpg/jpeg/png/gif/pdf/doc/docx",
            value => value && SUPPORTED_FORMATS.includes(value.type)
        ),
    capital_loss: Yup.number().positive().min(0).max(100).label('First loss capital')
})