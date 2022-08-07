export default function Final({ handlePrev, finalSubmit, formData }) {
    const handleClick = () => {
        finalSubmit(formData)
    }
    return (
        <div className="">
            <div className="font-light">
                <h4 className="text-primary font-normal">Loan Details</h4>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Pool Name: <span>{formData.loan_name}</span></p>
                    <p>Loan Amount: <span>{formData.loan_amount}</span></p>
                </div>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Loan Tenure: <span>{formData.loan_tenure}</span></p>
                    <p>Repayment Frequency: <span>{formData.payment_frequency}</span></p>
                </div>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Loan Interest: <span>{formData.loan_interest}</span></p>
                    <p>Loan Type: <span>{formData.loan_type == 1 ? 'Term Loan' : 'Bullet Loan'}</span></p>
                </div>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Loan Purpose: <span>{formData.loan_purpose}</span></p>
                </div>
            </div>
            <div className="font-light">
                <h4 className="text-primary font-normal">Collateral</h4>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Collateral Name: <span>{formData.collateral_document_name}</span></p>
                    <p>Collateral File: <span>{formData.collateral_document.name}</span></p>
                </div>
                <div style={{ display: 'flex' }} className='justify-between'>
                    <p>Collateral Document Description: <span>{formData.collateral_document_description}</span></p>
                </div>
            </div>
            <input onClick={handlePrev} className="btn btn-primary btn-wide" value='Back'></input>
            <input onClick={handleClick} className="btn btn-primary btn-wide" value='Submit'></input>
        </div>
    );
}