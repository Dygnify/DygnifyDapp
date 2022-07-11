import React from 'react';
import { useHistory } from 'react-router-dom';

const Opportunity = ({ data }) => {
    const path = useHistory();
    const id = data.collateral_document.slice(7, data.collateral_document.length)
    return (
        <div>
            <p>{data?.loan_amount}</p>
            <p>{data?.loan_tenure}</p>
            <p>{data?.loan_interest}</p>
            <button onClick={() => path.push(`/opportunity-details/${id}`)}>see more</button>
        </div>
    );
};

export default Opportunity;