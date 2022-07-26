import React from 'react';

const TransactionsCard = ({ data }) => {
    return (
        <div style={{ backgroundColor: '#20232A', borderRadius: '12px' }} className=" mb-2">
            <div style={{ display: 'flex' }} class="collapse-title text-md font-light justify-around w-full">
                <p className='w-1/6 text-center'>{data?.opportunity_name}</p>
                <p className='w-1/6 text-center'>{data?.date}</p>
                <p className='w-1/6 text-center'>{data?.type}</p>
                <p className='w-1/6 text-center'>{data?.amount} {process.env.REACT_APP_TOKEN_NAME}</p>
                {data?.status === 'Completed' && <p className='w-1/6 text-center'><button className='btn btn-xs btn-success'>Completed</button></p>}
                {data?.status === 'Not Completed' && <p className='w-1/6 text-center'><button className='btn btn-xs btn-error'>Not Completed</button></p>}
                {data?.status === 'Processing' && <p className='w-1/6 text-center'><button className='btn btn-xs btn-warning'>Processing</button></p>}
                <a className='w-1/6 text-center underline' href={data?.link}>Link</a>

            </div>
        </div >
    );
};

export default TransactionsCard;