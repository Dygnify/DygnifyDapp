import React, { useEffect, useState } from 'react';
import { getOpportunitysOf } from '../../components/transaction/TransactionHelper';
import DrawdownCard from '../../tools/Card/DrawdownCard';
import OpportunityCardCollapsible from '../../tools/Card/OpportunityCardCollapsible';

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
                        data.map(item => <DrawdownCard key={data?.id} data={item} />)
                    }
                </div>
            </div>
            <div className='mb-16'>
                <h2 className='mb-2 text-xl'>Borrow Request</h2>
                <div className="collapse mb-3">
                    <input type="checkbox" className="peer" />
                    <div style={{ display: 'flex', borderTop: '1px solid #20232A', borderBottom: '1px solid #20232A' }} className="collapse-title text-md font-light justify-around w-full">
                        <p className='w-1/4 text-center'>Pool Name</p>
                        <p className='w-1/4 text-center'>Capital Requested</p>
                        <p className='w-1/4 text-center'>Interest Rate</p>
                        <p className='w-1/4 text-center'>Status</p>
                    </div>
                </div>
                <div>
                    {
                        opportunities.map(item => <OpportunityCardCollapsible key={opportunities.id} data={item} />)
                    }
                </div>
            </div>
        </div>
    );
};

export default BorrowList;