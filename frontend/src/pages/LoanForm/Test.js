import React, { useEffect, useState } from 'react';
import { getOpportunityAt } from '../../components/transaction/TransactionHelper';
import { ExtractIPFSdataFromHash } from '../../services/PinataIPFSOptions';



const Test = () => {

    const id = 'QmfAKQahbuawKK3koZLZqsC4GHnmPkmk8oPakvvP3ThJ1W';
    useEffect(() => {
        const fetchData = async () => {
            await getOpportunityAt(id);

        }
        fetchData()
    }, [id]);

    return (
        <div>
            <h1>Loan Name</h1><br />
            <h2>Loan Purpose</h2>
        </div>
    );
};

export default Test;