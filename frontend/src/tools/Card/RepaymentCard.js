import React, { useState } from 'react';
import RepaymentModal from '../Modal/RepaymentModal';

const RepaymentCard = ({ data }) => {
    const [selected, setSelected] = useState(null)
    const handleRepayment = () => {
        setSelected(null)
    }
    return (
        <div style={{ boxShadow: `1px 1px 1px rgba(185, 185, 185, 0.1)` }} class="card text-white w-1/3" >
            <div style={{
                background: `linear-gradient(302.85deg, rgba(168, 154, 255, 0) -1.23%, rgba(168, 154, 255, 0.260833) 99.99%, rgba(168, 154, 255, 0.8) 100%`, borderRadius: '16px'
            }} class="card-body">
                <h2 class="card-title mb-4">{data?.opportunity_name} </h2>
                <div className='text-sm'>
                    <div style={{ display: 'flex' }} className='mb-2'>
                        <p style={{ display: 'flex' }} className='justify-start'>Capital Borrowed</p>
                        <p style={{ display: 'flex' }} className='justify-end'>{data?.loan_amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                    </div>
                    <div style={{ display: 'flex' }} className='mb-2'>
                        <p style={{ display: 'flex' }} className='justify-start'>Due Amount</p>
                        <p style={{ display: 'flex' }} className='justify-end'>{data?.repayment_amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                    </div>
                    <div style={{ display: 'flex' }} className='mb-2'>
                        <p style={{ display: 'flex' }} className='justify-start'>Due Date</p>
                        <p style={{ display: 'flex' }} className='justify-end'>{data?.repayment_date}</p>
                    </div>
                </div>
                <div class="justify-center w-full mt-6">
                    <label htmlFor="repayment-modal" style={{ borderRadius: '100px', padding: '12px 24px', color: 'white' }} className={`btn btn-secondary w-full hover:bg-blue-500 capitalize font-medium border-none`} onClick={() => setSelected(data)}>Make Repayment</label>
                </div>
                {
                    selected && <RepaymentModal key={data?.id} data={selected} handleRepayment={handleRepayment}></RepaymentModal>
                }
            </div>
        </div >
    );
};

export default RepaymentCard;