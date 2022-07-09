import React from 'react';
import { useHistory } from 'react-router-dom';

const Opportunity = ({ data }) => {
    const path = useHistory();
    return (
        <div>
            <p>{data.loan_amount}</p>
            <p>{data.loan_tenure}</p>
            <p>{data.loan_interest}</p>
            <button onClick={() => path.push(`/info/${data.borrower}`)}>see more</button>
        </div>
    );
};

export default Opportunity;