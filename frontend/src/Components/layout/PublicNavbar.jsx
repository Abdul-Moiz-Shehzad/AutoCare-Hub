import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/Components.css';
import { Wrench, LogIn, UserPlus } from 'lucide-react';

export default function PublicNavbar() {
  return (
    <nav className="navbar navbar-expand-lg public-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <div className="navbar-brand-icon">
            <Wrench size={20} color="#0f0e17" strokeWidth={2.5} />
          </div>
          <span className="navbar-brand-text">AutoCare Hub</span>
        </Link>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 nav-link-btn">
            <LogIn size={16} />
            Login
          </Link>
          <Link to="/signup" className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 nav-link-btn">
            <UserPlus size={16} />
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

