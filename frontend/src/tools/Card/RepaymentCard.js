import React from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import PrimaryButton from '../Button/PrimaryButton';

const RepaymentCard = ({ data }) => {
    const path = useNavigate();
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
                    <PrimaryButton data={{ id: data?.id }} width='w-full' onClick={() => path(`/repayment/${data?.id}`)}>Make Repayment Now</PrimaryButton>
                </div>
            </div>
        </div >
    );
};

export default RepaymentCard;