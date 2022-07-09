import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getOpportunitysOf } from '../../components/transaction/TransactionHelper';
import Opportunity from './Opportunity';

const OpportunityPage = () => {
    const navigate = useHistory();
    const [data, setData] = useState();
    const dataFetch = async () => {
        setData(await getOpportunitysOf());
    }
    console.log(data)
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>This is Borrower Dashboard</h2>
            <button onClick={() => navigate('/loan-form')}>Apply for Loan</button>
            <h4>Opportunity List</h4>
            <button onClick={dataFetch}>Get</button>
            {
                data?.map((item, index) => <Opportunity key={index} data={item}></Opportunity>)
            }
        </div>
    );
};

export default OpportunityPage;