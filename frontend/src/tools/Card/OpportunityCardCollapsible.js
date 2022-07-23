import React from 'react';

const OpportunityCardCollapsible = ({ data }) => {
    console.log(data)
    return (
        <div style={{ backgroundColor: '#20232A', borderRadius: '12px' }} className="collapse collapse-arrow  mb-2">
            <input type="checkbox" class="peer" />
            <div style={{ display: 'flex' }} class="collapse-title text-md font-light justify-around w-full">
                <p className='w-1/4 text-center'>Pool Name</p>
                <p className='w-1/4 text-center'>{data?.loan_amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                <p className='w-1/4 text-center'>{data?.loan_interest} %</p>
                <p className='w-1/4 text-center'>Under Review</p>
            </div>
            <div class="collapse-content">
                <div style={{ display: 'flex' }} className='justify-around py-10 w-full'>
                    <div style={{ borderRight: '1px solid #292C33', display: 'flex' }} className='w-1/2 text-center flex-col justify-center items-center'>
                        <p>Chart</p>
                    </div>
                    <div style={{ borderLeft: '1px solid #292C33', display: 'flex' }} className='w-1/2 justify-evenly items-center'>
                        <div style={{ display: 'flex' }} className='flex-col'>
                            <div className='mb-10'>
                                <p className='font-light text-sm'>Interest Rate</p>
                                <p className='font-medium text-lg'>{data?.loan_interest} %</p>
                            </div>
                            <div>
                                <p className='font-light text-sm'>Payment Frequency</p>
                                <p className='font-medium text-lg'>{data?.payment_frequency} %</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }} className='flex-col'>
                            <div className='mb-10'>
                                <p className='font-light text-sm'>Loan Tenure</p>
                                <p className='font-medium text-lg'>{data?.loan_tenure / 30} months</p>
                            </div>
                            <div>
                                <p className='font-light text-sm'>Loan Type</p>
                                <p className='font-medium text-lg'>{data?.loan_type === 0 ? 'Term Loan' : 'Bullet Loan'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityCardCollapsible;