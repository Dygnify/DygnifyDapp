import React from 'react';

const TextArea = ({ label, placeholder, className }) => {
    return (
        <div className={`${className}`}>
            <label class="label">
                <span class="text-white">{label}</span>
            </label>
            <textarea placeholder={placeholder} class={`textarea textarea-bordered h-36 ${className}`} style={{ backgroundColor: '#24272F', border: '2px solid #3A3C43', borderRadius: '8px' }}></textarea>
        </div>
    );
};

export default TextArea;