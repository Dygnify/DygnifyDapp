import { hover } from '@testing-library/user-event/dist/hover';
import React from 'react';

const PrimaryButton = ({ children }) => {
    return (
        <button style={{ borderRadius: '100px', padding: '12px 24px', color: 'white' }} className="btn btn-secondary btn-wide hover:bg-blue-500 capitalize font-medium border-none">{children}</button>
    );
};

export default PrimaryButton;