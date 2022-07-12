import React from 'react';
import { useHistory } from 'react-router-dom';

const Opportunity = ({ data }) => {
    const path = useHistory();
    const id = data.collateral_document.slice(7, data.collateral_document.length)
    return (
        <div style={{ border: '1px solid gray', padding: '10px 20px', margin: '20px' }}>
            <p>Loan Amount: {data?.loan_amount}</p>
            <p>Loan Tenure: {data?.loan_tenure}</p>
            <p>Loan Interest: {data?.loan_interest}</p>
            <button onClick={() => path.push(`/opportunity-details/${id}`)}>See Details</button>
        </div>
    );
};

export default Opportunity;