import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { getOpportunitysOf } from '../../components/transaction/TransactionHelper';
import Opportunity from './Opportunity';

const OpportunityPage = () => {
    const path = useHistory();
    const [data, setData] = useState();
    useEffect(() => {
        const dataFetch = async () => {
            const temp = await getOpportunitysOf();
            setData(temp)
        }
        dataFetch();
    }, [data])
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>This is Borrower Dashboard</h2>
            <button onClick={() => path.push('/loan-form')}>Apply for Loan</button>
            <h4>Opportunity List</h4>
            {
                data?.map((item, index) => <Opportunity key={index} data={item}></Opportunity>)
            }
        </div>
    );
};

export default OpportunityPage;