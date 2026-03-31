import React, { useState } from 'react';
import '../Styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, User, Briefcase, ShieldCheck, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const roleConfig = [
  { value: 'customer', label: 'Customer', icon: <User size={20} /> },
  { value: 'mechanic', label: 'Mechanic', icon: <Briefcase size={20} /> },
  { value: 'manager', label: 'Manager', icon: <ShieldCheck size={20} /> },
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
      mechanic: '/mechanic/dashboard',
      manager: '/manager/dashboard',
    };
    navigate(paths[selectedRole]);
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex auth-page">
      <div className="row g-0 w-100 flex-grow-1">
        
        {/* Left Side: Hero */}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 auth-hero">
          <div className="auth-hero-orb auth-hero-orb-bottom" />
          <div className="text-center auth-hero-content">
            <div className="d-inline-flex align-items-center justify-content-center mb-4 auth-logo">
              <Wrench size={28} color="#0f0e17" strokeWidth={2.5} />
            </div>
            <h2 className="display-5 fw-bold mb-3 auth-text-primary">Join AutoCare Hub</h2>
            <p className="lead mb-5 auth-text-secondary">
              Create your account and start managing vehicle services effortlessly.
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
            <div className="p-5">
              
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 d-lg-none auth-logo-sm">
                  <Wrench size={24} color="#0f0e17" strokeWidth={2.5} />
                </div>
                <h3 className="fw-bold auth-text-primary">Create Account</h3>
                <p className="auth-text-secondary">Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSignup}>
                
                {/* Role Selection Grid */}
                <div className="row g-2 mb-4">
                  {roleConfig.map((r) => (
                    <div className="col-4" key={r.value}>
                      <button
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`btn w-100 h-100 p-2 text-center auth-role-btn ${selectedRole === r.value ? 'active' : ''}`}
                      >
                        <div className="mb-1 d-flex justify-content-center auth-role-icon">
                          {r.icon}
                        </div>
                        <div className="fw-bold small auth-role-label">{r.label}</div>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Full Name Input */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-medium small auth-text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text auth-input-icon">
                      <UserPlus size={16} />
                    </span>
                    <input id="name" type="text" className="form-control auth-input-box" placeholder="John Doe" required />
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium small auth-text-secondary">Email</label>
                  <div className="input-group">
                    <span className="input-group-text auth-input-icon">
                      <Mail size={16} />
                    </span>
                    <input id="email" type="email" className="form-control auth-input-box" placeholder="you@example.com" required />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-5">
                  <label htmlFor="password" className="form-label fw-medium small auth-text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text auth-input-icon">
                      <Lock size={16} />
                    </span>
                    <input id="password" type="password" className="form-control auth-input-box" placeholder="••••••••" required />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary w-100 fw-bold py-3 mb-3 d-flex align-items-center justify-content-center gap-2">
                  Create Account
                  <ArrowRight size={18} />
                </button>

                {/* Sign In Link */}
                <p className="text-center small mb-0 auth-text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="fw-bold text-decoration-none auth-text-accent">
                    Sign in
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