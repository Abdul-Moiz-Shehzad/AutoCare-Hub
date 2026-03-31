import React from 'react';
import '../Styles/NotFound.css';
import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="d-flex min-vh-100 flex-column align-items-center justify-content-center px-4 text-center notfound-page">
      {/* Decorative orb */}
      <div className="notfound-orb" />
      
      <div className="position-relative z-1">
        <div className="d-flex align-items-center justify-content-center mb-4 notfound-icon-box">
          <SearchX size={36} className="auth-text-accent" />
        </div>
        <h1 className="display-1 fw-bold accent-gradient-text">404</h1>
        <p className="lead mb-4 auth-text-secondary">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary btn-lg fw-medium d-inline-flex align-items-center gap-2 px-4">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;