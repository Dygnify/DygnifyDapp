import React, { useState } from 'react';
import { UseContextProvider } from '../../pages/Borrower/Contexts/StepperContext';
import Stepper from '../../pages/Borrower/LoanForm/Stepper';
import StepperControl from '../../pages/Borrower/LoanForm/StepperControl';
import Account from '../../pages/Borrower/LoanForm/Steps/Account';
import Details from '../../pages/Borrower/LoanForm/Steps/Details';
import Final from '../../pages/Borrower/LoanForm/Steps/Final';


const LoanFormModal = ({ handleForm }) => {

    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        "Add Loan Details",
        "Add Collateral",
        "Submit for Review",
    ];

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Account />;
            case 2:
                return <Details />;
            case 3:
                return <Final />;
            default:
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;

        direction === "next" ? newStep++ : newStep--;
        // check if steps are within bounds
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    };

    return (
        <div>
            <input type="checkbox" id="loanForm-modal" class="modal-toggle" />
            <div class="modal" style={{ backdropFilter: 'brightness(40%) blur(8px)' }}>
                <div style={{ backgroundColor: '#20232A', borderRadius: '16px' }} class="modal-box w-1/2 max-w-5xl p-0">
                    <label for="loanForm-modal" class="btn btn-ghost absolute right-2 top-2 pb-2" onClick={() => handleForm()}>✕</label>
                    <h3 style={{ borderBottom: '2px solid #292C33' }} className="font-bold text-lg py-3 px-4">Create Borrow Request</h3>
                    <div className="mx-auto pb-2 ">
                        {/* Stepper */}
                        <div className="mt-5 ">
                            <Stepper steps={steps} currentStep={currentStep} />

                            <div className="mt-4 p-10 ">
                                <UseContextProvider>{displayStep(currentStep)}</UseContextProvider>
                            </div>
                        </div>

                        {/* navigation button */}
                        {currentStep !== steps.length + 1 && (
                            <StepperControl
                                handleClick={handleClick}
                                currentStep={currentStep}
                                steps={steps}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoanFormModal;