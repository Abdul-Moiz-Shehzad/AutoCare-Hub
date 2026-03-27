import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className="sidebar p-4 d-flex flex-column" style={{ 
            width: '260px', 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            height: '100vh', 
            borderRight: '1px solid var(--border-color)', 
            zIndex: 1040, 
            backgroundColor: 'var(--surface, #131316)' 
        }}>
            <div className="d-flex align-items-center gap-3 mb-5">
                <div
                    className="rounded d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-container, #4e4feb)' }}
                >
                    <i className="bi bi-gear-wide-connected fs-5 text-white"></i>
                </div>
                <div>
                    <h1 className="fs-5 fw-bold mb-0 text-uppercase font-headline" style={{ color: 'var(--primary, #c0c1ff)' }}>AutoCare</h1>
                    <p className="text-secondary small mb-0" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                        Precision Hub
                    </p>
                </div>
            </div>

            <nav className="d-flex flex-column gap-2 flex-grow-1">
                <Link 
                    className="nav-link-custom rounded p-3 text-decoration-none d-flex align-items-center gap-3" 
                    to="/"
                >
                    <i className="bi bi-grid-1x2-fill fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Overview</span>
                </Link>
                <a className="nav-link-custom rounded p-3 text-decoration-none d-flex align-items-center gap-3" href="#!">
                    <i className="bi bi-car-front-fill fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Vehicles</span>
                </a>
                <Link className={`nav-link-custom rounded p-3 text-decoration-none d-flex align-items-center gap-3 ${currentPath === '/' ? 'nav-link-active' : ''}`} to="/">
                    <i className="bi bi-wrench-adjustable fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Work Orders</span>
                </Link>
                <a className="nav-link-custom rounded p-3 text-decoration-none d-flex align-items-center gap-3" href="#!">
                    <i className="bi bi-people-fill fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Staff</span>
                </a>
                <a className="nav-link-custom rounded p-3 text-decoration-none d-flex align-items-center gap-3" href="#!">
                    <i className="bi bi-gear-fill fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Settings</span>
                </a>
            </nav>

            <div className="mt-auto pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <Link
                    to="/schedule"
                    className={`btn w-100 text-uppercase fw-bold shadow-sm mb-4 d-flex justify-content-center align-items-center ${currentPath === '/schedule' ? 'text-white' : 'text-white'}`}
                    style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.1em', 
                        paddingTop: '15px', 
                        paddingBottom: '15px', 
                        backgroundColor: 'var(--primary-container, #4e4feb)', 
                        boxShadow: '0 0 20px rgba(78,79,235,0.2)' 
                    }}
                >
                    <i className="bi bi-plus-lg me-2"></i> New Service
                </Link>
                <a className="nav-link-custom text-decoration-none d-flex align-items-center gap-3 mb-3 p-2" href="#support">
                    <i className="bi bi-question-circle fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Support</span>
                </a>
                <a className="nav-link-custom text-decoration-none d-flex align-items-center gap-3 p-2" href="#logout">
                    <i className="bi bi-box-arrow-right fs-5"></i> 
                    <span className="font-headline text-uppercase tracking-widest" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>Logout</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
