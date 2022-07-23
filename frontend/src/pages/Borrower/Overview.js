import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import DrawdownCard from '../../tools/Card/DrawdownCard';
import RepaymentCard from '../../tools/Card/RepaymentCard';

const Overview = () => {

    const [data, setData] = useState([]);
    const [repayment, setRepayment] = useState([]);


    useEffect(() => {
        fetch('/drawdown.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])

    useEffect(() => {
        fetch('/repayment.json')
            .then(res => res.json())
            .then(data => setRepayment(data))
    }, [])

    return (
        <div>
            <div className='mb-16 text-xl'>
                <h2 className='mb-2'>Repayment Notification</h2>
                <div style={{ display: 'flex' }} className='gap-4'>
                    {
                        repayment.map(item => <RepaymentCard key={data.id} data={item} />)
                    }
                </div>
            </div>
            <div className='mb-16'>
                <h2 className='mb-2 text-xl'>Drawdown Funds</h2>
                <div style={{ display: 'flex' }} className=' gap-4'>
                    {
                        data.map(item => <DrawdownCard key={data.id} data={item} />)
                    }
                </div>
            </div>


        </div>
    );
};

export default Overview; <h2>Overview</h2>