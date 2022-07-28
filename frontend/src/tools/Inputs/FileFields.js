import React from 'react';

const FileFields = ({ label, placeholder, className }) => {
    return (
        <div className={`${className}`}>
            <label class="label">
                <span class="text-white">{label}</span>
            </label>
            <input type="file" placeholder="Type here" className="input input-bordered w-full" style={{ backgroundColor: '#24272F', border: '2px dashed #3A3C43', borderRadius: '8px' }} />
        </div>

    );
};

export default FileFields;