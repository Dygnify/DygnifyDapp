import React from 'react';
import GradientButton from './Button/GradientButton';
import PrimaryButton from './Button/PrimaryButton';

const ToolTest = ({ children }) => {
    return (
        <div>
            <PrimaryButton>Withdraw</PrimaryButton>
            <GradientButton>Borrow Request</GradientButton>
        </div >
    );
};

export default ToolTest;