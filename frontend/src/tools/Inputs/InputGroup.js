import React from 'react';
import FileFields from './FileFields';
import TextField from './TextField';

const InputGroup = ({ caption }) => {
    return (
        <div className='bg-[#20232A]  w-full px-4 pb-4 mb-2' style={{ borderRadius: '17px' }}>
            <h2 className='pt-2'>{caption}</h2>
            <div className='justify-between' style={{ display: 'flex' }}>

                <TextField label='Document Name' placeholder='Enter Document Name' className='w-1/2 mr-4'></TextField>
                <FileFields label='Upload Document' className='w-1/2 ml-4'></FileFields>
            </div>
        </div>

    );
};

export default InputGroup;