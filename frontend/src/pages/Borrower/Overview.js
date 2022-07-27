import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import DrawdownCard from '../../tools/Card/DrawdownCard';
import DueDateCard from '../../tools/Card/DueDateCard';
import RepaymentCard from '../../tools/Card/RepaymentCard';
import DashboardHeader from './DashboardHeader';

const Overview = () => {

    const [data, setData] = useState([]);
    const [repayment, setRepayment] = useState([]);
    const [dueList, setDueList] = useState([]);


    useEffect(() => {
        fetch('/drawdown.json')
            .then(res => res.json())
            .then(data => setData(data))
    }, [data])

    useEffect(() => {
        fetch('/repayment.json')
            .then(res => res.json())
            .then(data => setRepayment(data))
    }, [repayment])

    useEffect(() => {
        fetch('/dueList.json')
            .then(res => res.json())
            .then(data => setDueList(data))
    }, [dueList])

    return (
        <div>
            <DashboardHeader></DashboardHeader>
            <div style={{ display: 'flex' }} className='w-full my-10'>
                <div style={{ backgroundColor: '#191D23', boxShadow: '4px 4px 10px -32px rgba(0, 0, 0, 0.1)', borderRadius: '16px', display: 'flex' }} className='w-1/4 mr-4 px-4 py-4 justify-center flex-col'>
                    <h1 className='font-semibold text-5xl text-green-400'>$850K</h1>
                    <p className='text-xl'>Total Amount Borrowed</p>
                </div>
                <div style={{ backgroundColor: '#191D23', boxShadow: '4px 4px 10px -32px rgba(0, 0, 0, 0.1)', borderRadius: '16px' }} className='w-1/2 px-4 py-6'>
                    <h2 className='text-xl font-semibold text-gray-500'>Amount Distribution</h2>
                </div>
                <div style={{ boxShadow: '4px 4px 10px -32px rgba(0, 0, 0, 0.1)' }} className='w-1/4 ml-4 '>
                    <div style={{ backgroundColor: '#191D23', borderRadius: '16px' }} className='mb-4 px-4 py-4'>
                        <h3 className='font-semibold text-3xl text-purple-100'>$400K</h3>
                        <p className='text-base font-semibold text-gray-500'>Next Due Amount</p>
                    </div>
                    <div style={{ backgroundColor: '#191D23', borderRadius: '16px' }} className='px-4 py-4'>
                        <h3 className='font-semibold text-3xl text-purple-100'>28 July 2022</h3>
                        <p className='text-base font-semibold text-gray-500'>Next Due Date</p>
                    </div>
                </div>
            </div>
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
            <div className='mb-16'>
                <h2 className='mb-2 text-xl'>Upcoming Due Dates</h2>
                <div className="collapse mb-3">
                    <input type="checkbox" className="peer" />
                    <div style={{ display: 'flex', borderTop: '1px solid #20232A', borderBottom: '1px solid #20232A' }} className="collapse-title text-md font-light justify-around w-full">
                        <p className='w-1/4 text-center'>Pool Name</p>
                        <p className='w-1/4 text-center'>Capital Borrowed</p>
                        <p className='w-1/4 text-center'>Amount Due</p>
                        <p className='w-1/4 text-center'>Due Date</p>
                    </div>
                </div>
                <div>
                    {
                        dueList.map(item => <DueDateCard key={dueList.id} data={item} />)
                    }
                </div>
            </div>

        </div>
    );
};

export default Overview;