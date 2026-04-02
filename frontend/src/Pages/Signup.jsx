import React, { useState } from 'react';
import '../Styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, User, ShieldCheck, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const roleConfig = [
  { value: 'customer', label: 'Customer', desc: 'Book & track services', icon: <User size={24} /> },
  { value: 'manager', label: 'Manager', desc: 'Run the workshop', icon: <ShieldCheck size={24} /> },
];

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    login(selectedRole);
    const paths = {
      customer: '/customer/dashboard',
      manager: '/manager/dashboard',
    };
    navigate(paths[selectedRole]);
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex auth-page">
      <div className="row g-0 w-100 flex-grow-1">
        
        {/* Left Side: Hero */}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 auth-hero">
          <div className="auth-hero-orb auth-hero-orb-top" />
          <div className="auth-hero-orb auth-hero-orb-bottom" />
          <div className="text-center auth-hero-content">
            <div className="d-inline-flex align-items-center justify-content-center mb-4 auth-logo">
              <Wrench size={32} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h2 className="display-5 fw-bold mb-3 text-white" style={{ letterSpacing: '-1px' }}>Join AutoCare Hub</h2>
            <p className="lead mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Create your account and experience precision automotive management.
            </p>
            <div className="auth-hero-image">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop"
                alt="Automotive diagnostic"
                className="img-fluid w-100 d-block"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 auth-page">
          <div className="w-100 auth-form-card">
            <div className="p-4 p-sm-5">
              
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 d-lg-none auth-logo-sm">
                  <Wrench size={24} color="#ffffff" strokeWidth={2.5} />
                </div>
                <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: '-0.5px' }}>Create Account</h3>
                <p className="text-muted">Select your role and fill in your details to get started.</p>
              </div>

              <form onSubmit={handleSignup}>
                
                {/* Role Selection Grid (2 roles for Signup) */}
                <div className="auth-role-grid auth-role-grid--two mb-4">
                  {roleConfig.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setSelectedRole(r.value)}
                      className={`btn auth-role-btn ${selectedRole === r.value ? 'active' : ''}`}
                    >
                      <span className="auth-role-icon d-flex justify-content-center mb-1">
                        {r.icon}
                      </span>
                      <span className="fw-bold auth-role-label d-block">{r.label}</span>
                      <span className="auth-role-desc d-block mt-1 opacity-75">{r.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Full Name Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <UserPlus size={16} />
                    </span>
                    <input id="name" type="text" className="form-control" placeholder="John Doe" required />
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={16} />
                    </span>
                    <input id="email" type="email" className="form-control" placeholder="you@example.com" required />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-5">
                  <label htmlFor="password" className="form-label fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={16} />
                    </span>
                    <input id="password" type="password" className="form-control" placeholder="••••••••" required />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 fw-bold py-3 mb-4 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '1.05rem' }}>
                  Create Account
                  <ArrowRight size={18} />
                </button>

                {/* Sign In Link */}
                <p className="text-center small mb-0 text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--accent-primary)' }}>
                    Sign in here
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;