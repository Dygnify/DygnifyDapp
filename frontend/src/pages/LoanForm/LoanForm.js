import { makeStyles, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import CollateralDocuments from './CollateralDocuments';
import ConfirmSubmission from './ConfirmSubmission';
import LoanDetails from './LoanDetails';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles({
    root: {
        width: "50%",
        margin: "6rem auto",
        border: "1px solid #999",
    },
    btn: {
        display: 'grid',
        width: '70%',
        margin: '0 auto 3rem auto'
    }
})

const LoanForm = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        loan_type: "",
        loan_amount: "",
        loan_purpose: "",
        loan_tenure: "",
        loan_interest: "",
        payment_frequency: ""
    });

    const [activeStep, setActiveStep] = useState(0);

    const finalSubmit = (data) => {
        let { loan_type, loan_amount, loan_purpose, loan_tenure, loan_interest, capital_loss, payment_frequency, ...rest } = data;
        loan_tenure = loan_tenure * 30;
        const collateral_document = rest;
        const loanDetails = { loan_type, loan_amount, loan_purpose, loan_tenure, loan_interest, payment_frequency, capital_loss }
        console.log(collateral_document);
        console.log(loanDetails);

        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    const handleNext = (newData, value) => {
        if (value === true) {
            let temp = { ...formData, ...newData }
            setFormData(temp)
        }
        else {
            setFormData((prev) => ({ ...prev, ...newData }))
        }
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handlePrev = (newData) => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const getSteps = () => {
        return ['Loan Details', 'Collateral Documents', 'Confirm Submission'];
    }

    const steps = getSteps();

    const getStepsContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <LoanDetails handleNext={handleNext} formData={formData} ></LoanDetails>;
            case 1:
                return <CollateralDocuments
                    handleNext={handleNext} handlePrev={handlePrev} formData={formData} ></CollateralDocuments>;
            case 2:
                return <ConfirmSubmission handlePrev={handlePrev} finalSubmit={finalSubmit} formData={formData} ></ConfirmSubmission>;
            default:
                return "Unknown Step";
        }
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {
                    steps.map((step, index) => (
                        <Step key={step}>
                            <StepLabel>
                                {step}
                            </StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
            {activeStep === steps.length ?
                <>
                    <Typography
                        variant='h5'
                        style={{ color: '#999', textAlign: 'center', margin: '1rem 0' }}
                    >
                        <CheckCircleIcon
                            style={{ fontSize: '80px' }}
                            color='success'
                        ></CheckCircleIcon>
                        <br />
                        Loan Request Submitted Successfully
                    </Typography>
                </>
                : (
                    <>
                        {getStepsContent(activeStep)}
                    </>
                )}
        </div>
    );
};

export default LoanForm;