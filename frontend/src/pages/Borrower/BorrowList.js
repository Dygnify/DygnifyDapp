import React, { useEffect, useState } from 'react';
import { getOpportunitysOf } from '../../components/transaction/TransactionHelper';
import DrawdownCard from '../../tools/Card/DrawdownCard';

const BorrowList = () => {
    const [data, setData] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    useEffect(() => {
        fetch('/drawdown.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, []);

    useEffect(() => {
        try {
            const fetchData = async () => {
                console.log("******************");
                let opportunities = await getOpportunitysOf();
                setOpportunities(opportunities);
                console.log(opportunities);
            };
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div>
            <div className='mb-16'>
                <h2 className='mb-2 text-xl'>Drawdown Funds</h2>
                <div style={{ display: 'flex' }} className=' gap-4'>
                    {
                        data.map(item => <DrawdownCard key={data.id} data={item} />)
                    }
                </div>
            </div>
            <div className='mb-16'>
                <h2 className='mb-2 text-xl'>Borrow Request</h2>
                <div className='py-4 justify-around' style={{ display: 'flex', borderTop: '1px solid #20232A', borderBottom: '1px solid #20232A' }}>
                    <p>Pool Name</p>
                    <p>Capital Requested</p>
                    <p>Created on</p>
                    <p>Status</p>
                </div>
                <div style={{ display: 'flex' }} className=' gap-4'>
                    {
                        opportunities.map(item => <DrawdownCard key={opportunities.id} data={item} />)
                    }
                </div>
            </div>
        </div>
    );
};

export default BorrowList;