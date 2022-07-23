import React from 'react';

const PrimaryButton = ({ children, width, onClick, data }) => {
    return (
        <button onClick={onClick} style={{ borderRadius: '100px', padding: '12px 24px', color: 'white' }} className={`btn btn-secondary btn-wide hover:bg-blue-500 capitalize font-medium border-none ${width}`}>{children}</button>
    );
};

export default PrimaryButton;