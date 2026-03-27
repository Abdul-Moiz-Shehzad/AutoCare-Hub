import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <header
            className="bg-surface-low border-bottom d-flex justify-content-between align-items-center px-5 py-3 sticky-top"
            style={{ borderColor: 'var(--border-color, rgba(255, 255, 255, 0.05))', zIndex: 1030 }}
        >
            <div className="d-flex align-items-center gap-4">
                <h2 className="h5 fw-bold text-uppercase font-headline mb-0" style={{ color: 'var(--primary, #c0c1ff)' }}>Service Hub</h2>
                <nav className="d-none d-md-flex gap-4">
                    <Link 
                        className={currentPath === '/' ? "text-decoration-none border-bottom border-2 pb-1 small fw-bold" : "text-secondary text-decoration-none small fw-bold"} 
                        style={currentPath === '/' ? { color: 'var(--primary, #c0c1ff)', borderColor: 'var(--primary-container, #4e4feb)' } : {}}
                        to="/"
                    >
                        Dashboard
                    </Link>
                    <a className="text-secondary text-decoration-none small fw-bold" href="#inventory">Inventory</a>
                    <Link 
                        className={currentPath === '/schedule' ? "text-decoration-none border-bottom border-2 pb-1 small fw-bold" : "text-secondary text-decoration-none small fw-bold"} 
                        style={currentPath === '/schedule' ? { color: 'var(--primary, #c0c1ff)', borderColor: 'var(--primary-container, #4e4feb)' } : {}}
                        to="/schedule"
                    >
                        Schedule
                    </Link>
                    <a className="text-secondary text-decoration-none small fw-bold" href="#reports">Reports</a>
                </nav>
            </div>
            <div className="d-flex align-items-center gap-4">
                <div className="position-relative">
                    <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-secondary"></i>
                    <input
                        className="form-control bg-dark border-0 text-light rounded-pill ps-5 py-2"
                        placeholder="Search orders..."
                        type="text"
                        style={{ width: '250px', fontSize: '0.8rem' }}
                    />
                </div>
                <button className="btn btn-dark border-0 rounded-circle text-secondary"><i className="bi bi-bell"></i></button>
                <button className="btn btn-dark border-0 rounded-circle text-secondary"><i className="bi bi-gear"></i></button>
                <img alt="User profile avatar" className="avatar border border-secondary rounded-circle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn4mJ3ECKEHQYmewBD53uWP1hGoHLJPVL5WkUNjFLqP1A9qLw77C2hVWT3CTRIgIrUQ8PpGhJ-etLBw4hfZOOQ99fQiCgEWPgqUP9cvDQ7cLmAThmrIeRE78BDcmE2i5T9FNXiRHLylySQG1iGiAYCSd-Uc6ArYGPsbkWEr1zYdJ94os3kKe1aKxuBzN5tQtVfuKTko0HxV5S9QZOehKlUFom3gokREcwE6LpQ4iJSf8ZrjTUpZPMf6OtDCla2EGUjlj63-dycE6g" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
            </div>
        </header>
    );
};

export default Navbar;
