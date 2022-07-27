import React from 'react';

const DocumentCard = () => {
    return (
        <div style={{ backgroundColor: '#20232A', borderRadius: '8px', display: 'flex', padding: '11px 16px' }} className='justify-between mb-2'>
            <p>Docname</p>
            <a className='text-blue-700' href="#">View Document</a>
        </div>
    );
};

export default DocumentCard;