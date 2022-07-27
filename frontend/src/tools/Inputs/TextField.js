import React from 'react';

const TextField = ({ label, placeholder, className }) => {
    return (
        <div className={`${className}`}>
            <label class="label">
                <span class="text-white">{label}</span>
            </label>
            <input type="text" placeholder={placeholder} className="input input-bordered w-full" style={{ backgroundColor: '#24272F', border: '2px solid #3A3C43', borderRadius: '8px' }} />
        </div>

    );
};

export default TextField;