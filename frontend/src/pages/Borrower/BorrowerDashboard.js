import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import GradientButton from '../../tools/Button/GradientButton';

const BorrowerDashboard = () => {
    const navigate = useNavigate();
    return (
        <div style={{ backgroundColor: '#14171F' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #20232A' }} className='justify-between px-5 py-3'>
                <img src="images/logo.png" alt="" />
                {/* <GradientButton className='btn-outline'>Connected</GradientButton> */}
            </div>
            <div className="drawer drawer-mobile">
                <input id="dashboard-sidebar" type="checkbox" className="drawer-toggle" />
                <div className="mt-6 drawer-content text-white">
                    <div className='px-5'>
                        <div style={{ display: 'flex' }} className='items-center justify-between mb-14'>
                            <h2 className='text-left first-line:text-3xl font-bold text-white'>Borrower Dashboard</h2>
                            <GradientButton onClick={() => navigate('/loan-form')}>Borrow Request</GradientButton>
                        </div>
                        <Outlet></Outlet>
                    </div>
                </div>

                <div style={{ borderRight: '1px solid #20232A' }} className="drawer-side">
                    <label htmlFor="dashboard-sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 overflow-y-auto w-60  text-white">
                        <li><Link to='/borrower_dashboard'>Overview</Link></li>
                        <li><Link to='/borrower_dashboard/borrow_list'>Borrow</Link></li>
                        <li><Link to='/borrower_dashboard'>Transactions</Link></li>
                        <li><Link to='/borrower_dashboard'>Profile</Link></li>
                    </ul>
                </div>
            </div>

        </div >

    );
};

export default BorrowerDashboard;