import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../../tools/Button/GradientButton';

const DashboardHeader = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex' }} className='items-center justify-between mb-14'>
            <h2 className='text-left first-line:text-3xl font-bold text-white'>Borrower Dashboard</h2>
            <GradientButton onClick={() => navigate('/loan-form')}>Borrow Request</GradientButton>
        </div>
    );
};

export default DashboardHeader;