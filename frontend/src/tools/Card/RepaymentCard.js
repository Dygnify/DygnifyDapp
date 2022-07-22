import React from 'react';
import { useHistory } from 'react-router-dom';
import PrimaryButton from '../Button/PrimaryButton';

const RepaymentCard = ({ data }) => {
    const path = useHistory();
    return (
        <div style={{ boxShadow: `1px 1px 1px rgba(185, 185, 185, 0.1)` }} class="card w-96 text-white" >
            <div style={{
                background: `linear-gradient(302.85deg, rgba(168, 154, 255, 0) -1.23%, rgba(168, 154, 255, 0.260833) 99.99%, rgba(168, 154, 255, 0.8) 100%`, borderRadius: '16px'
            }} class="card-body">
                <h2 class="card-title mb-2">{data?.opportunity_name} </h2>
                <div className='text-sm'>
                    <div className='flex m-0 justify-between'>
                        <p className='flex-1'>Capital Borrowed</p>
                        <p className='flex-1'>{data?.loan_amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                    </div>
                    <div className='flex m-0 justify-between'>
                        <p className='flex-1'>Due Amount</p>
                        <p className='flex-1'>{data?.repayment_amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                    </div>
                    <div className='flex m-0 justify-between'>
                        <p className='flex-1'>Due Date</p>
                        <p className='flex-1'>{data?.repayment_date}</p>
                    </div>
                </div>
                <div class="justify-center w-full mt-6">
                    <PrimaryButton data={{ id: data?.id }} width='w-full' onClick={() => path.push(`/repayment/${data?.id}`)}>Make Repayment Now</PrimaryButton>
                </div>
            </div>
        </div >
    );
};

export default RepaymentCard;