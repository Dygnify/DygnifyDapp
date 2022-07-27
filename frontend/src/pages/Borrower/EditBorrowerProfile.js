import React from 'react';
import GradientButton from '../../tools/Button/GradientButton';
import FileFields from '../../tools/Inputs/FileFields';
import InputGroup from '../../tools/Inputs/InputGroup';
import TextArea from '../../tools/Inputs/TextArea';
import TextField from '../../tools/Inputs/TextField';

const EditBorrowerProfile = () => {
    return (
        <div>
            <div className='mb-6'>
                <h2 className='text-xl font-medium'>Company Details</h2>
                <div style={{ display: 'flex' }} className='w-full'>
                    <FileFields label='Company Logo' className='w-1/3'></FileFields>
                    <TextField label='Company Name' placeholder='Enter Company Name' className='w-1/3 ml-2'></TextField>
                    <TextField label='individual Name' placeholder='Borrower Name' className='w-1/3 ml-2'></TextField>
                </div>
                <div>
                    <TextArea label='Bio' placeholder='Summary About the Organization/Company' className='w-full'></TextArea>
                </div>
            </div>
            <div className='mb-6'>
                <h2 className='text-xl font-medium mb-2'>KYC Documents</h2>
                <InputGroup></InputGroup>
            </div>
            <div className='mb-6'>
                <h2 className='text-xl font-medium mb-2'>KYB Documents</h2>
                <InputGroup caption='Business Identify Proof'></InputGroup>
                <InputGroup caption='Business Address Proof'></InputGroup>
                <InputGroup caption='Business Incorporation Proof'></InputGroup>
                <InputGroup caption='Business License Proof'></InputGroup>
            </div>
            <div className='mb-6'>
                <h2 className='text-xl font-medium mb-2'>Socials</h2>
                <div className='w-full' style={{ display: 'flex' }}>
                    <TextField label='Website' placeholder='Enter Website URL' className='w-1/2 mr-8'></TextField>
                    <TextField label='Email Address' placeholder='Enter Email Address' className='w-1/2 ml-8'></TextField>
                </div>
                <div className='w-full' style={{ display: 'flex' }}>
                    <TextField label='Twitter' placeholder='Enter Twitter URL' className='w-1/2 mr-8'></TextField>
                    <TextField label='LinkedIn' placeholder='Enter LinkedIn URL' className='w-1/2 ml-8'></TextField>
                </div>
            </div>
            <div className='my-10 justify-center' style={{ display: 'flex' }}>
                <button style={{ borderRadius: '100px', padding: '12px 24px', color: 'white' }} className='btn btn-wide btn-outline text-white mr-4'>Exit</button>
                <GradientButton className='font-medium ml-4'>Save and Exit</GradientButton>
            </div>
        </div>
    );
};

export default EditBorrowerProfile;