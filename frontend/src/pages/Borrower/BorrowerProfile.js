import React from 'react';
import DocumentCard from '../../tools/Card/DocumentCard';
import { useNavigate } from 'react-router';

const BorrowerProfile = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='mb-16 '>
                <h2 className='mb-6 text-2xl font-medium'>Borrower Profile</h2>
                <div style={{ display: 'flex' }} className='justify-between items-center mb-6'>
                    <div style={{ display: 'flex' }}>
                        <div class="avatar">
                            <div class="w-16 rounded-full">
                                <img src="https://placeimg.com/192/192/people" alt='' />
                            </div>
                        </div>
                        <div style={{ display: 'flex' }} className='flex-col justify-center ml-4'>
                            <h4 className='text-md'>Company Name</h4>
                            <p className='text-xs'>Owner Name</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/borrower_dashboard/edit_profile')} style={{ borderRadius: '100px', padding: '8px 16px' }} className='btn btn-sm btn-outline text-white'>Edit Profile</button>
                </div>
                <div style={{ display: 'flex' }} className='w-full justify-between mb-6'>
                    <div className='w-1/2'>
                        <h5 className='text-lg'>Socials</h5>
                    </div>
                    <div style={{ display: 'flex' }} className='w-1/2 justify-end'>
                        <button style={{ borderRadius: '100px', padding: '8px 16px' }} className='ml-3 btn btn-sm btn-outline text-white'>Twitter</button>
                        <button style={{ borderRadius: '100px', padding: '8px 16px' }} className='ml-3 btn btn-sm btn-outline text-white'>LinkedIn</button>
                        <button style={{ borderRadius: '100px', padding: '8px 16px' }} className='ml-3 btn btn-sm btn-outline text-white'>Email</button>
                        <button style={{ borderRadius: '100px', padding: '8px 16px' }} className='ml-3 btn btn-sm btn-outline text-white'>Website</button>
                    </div>
                </div>
                <div className='mb-6'>
                    <h5 className='text-lg'>Bio</h5>
                    <p className='text-sm font-light text-justify'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus atque quisquam tenetur eos corporis reprehenderit facilis dolor vero soluta vitae, quo doloremque molestiae aperiam nostrum! Similique veniam eos ad dolor laborum, illum ullam quod numquam quaerat cum officiis accusantium placeat, eaque nostrum molestias, voluptatibus quidem! Dolores veniam tempora quos molestias amet similique maiores odit, eum nesciunt soluta fugit! Excepturi maiores sint, quas quisquam placeat eum maxime quasi qui praesentium eaque necessitatibus. Quidem sapiente inventore ea porro nisi, in hic perspiciatis amet nihil labore officia magnam, tempora deleniti corporis at totam quod praesentium vel? Velit officia quos qui, nulla, laborum quae recusandae incidunt aperiam et optio quo veritatis placeat? Accusantium minima ut delectus vitae saepe? Maiores quod veritatis beatae blanditiis laboriosam.</p>
                </div>

                <div className='mb-6'>
                    <h5 className='text-lg'>KYC Details</h5>
                    <DocumentCard></DocumentCard>
                    <DocumentCard></DocumentCard>
                </div>
                <div className='mb-6'>
                    <h5 className='text-lg'>KYB Details</h5>
                    <h6 className='text-neutral text-sm'>Business Identify Proof</h6>
                    <DocumentCard></DocumentCard>
                    <DocumentCard></DocumentCard>
                    <h6 className='text-neutral text-sm'>Business Address Proof</h6>
                    <DocumentCard></DocumentCard>
                    <h6 className='text-neutral text-sm'>Business License Proof</h6>
                    <DocumentCard></DocumentCard>
                    <h6 className='text-neutral text-sm'>Business Incorporation Proof</h6>
                    <DocumentCard></DocumentCard>
                </div>
            </div>
        </div>
    );
};

export default BorrowerProfile;