import React, { useState } from 'react';
import '../Styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, User, Briefcase, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

const roles = [
  { value: 'customer', label: 'Customer', desc: 'Book & track', icon: <User size={22} /> },
  { value: 'mechanic', label: 'Mechanic', desc: 'Manage jobs', icon: <Briefcase size={22} /> },
  { value: 'manager', label: 'Manager', desc: 'Run workshop', icon: <ShieldCheck size={22} /> },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
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
        
        {}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 auth-hero">
          <div className="auth-hero-orb auth-hero-orb-top" />
          <div className="auth-hero-orb auth-hero-orb-bottom" />
          <div className="text-center auth-hero-content">
            <div className="d-inline-flex align-items-center justify-content-center mb-4 auth-logo">
              <Wrench size={32} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h2 className="display-5 fw-bold mb-3 text-white" style={{ letterSpacing: '-1px' }}>Welcome Back</h2>
            <p className="lead mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Log in to manage your vehicle services and track maintenance progress.
            </p>
            <div className="auth-hero-image">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop"
                alt="Automotive service"
                className="img-fluid w-100 d-block"
              />
            </div>
          </div>
        </div>

        {}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 auth-page">
          <div className="w-100 auth-form-card">
            <div className="p-4 p-sm-5">
              
              <div className="text-center mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 d-lg-none auth-logo-sm">
                  <Wrench size={24} color="#ffffff" strokeWidth={2.5} />
                </div>
                <h3 className="fw-bold text-white mb-1" style={{ letterSpacing: '-0.5px' }}>Sign In</h3>
                <p className="text-muted">Select your role and sign in to continue.</p>
              </div>

              <form onSubmit={handleLogin}>
                
                {}
                <div className="auth-role-grid mb-4">
                  {roles.map((r) => (
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
                      <span className="auth-role-desc d-none d-sm-block mt-1 opacity-75">{r.desc}</span>
                    </button>
                  ))}
                </div>

                {}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={16} />
                    </span>
                    <input 
                      id="email" 
                      type="email" 
                      className="form-control" 
                      placeholder="you@example.com" 
                      defaultValue="john@example.com" 
                      required
                    />
                  </div>
                </div>

                {}
                <div className="mb-5">
                  <label htmlFor="password" className="form-label fw-medium small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Lock size={16} />
                    </span>
                    <input 
                      id="password" 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      defaultValue="password123" 
                      required 
                    />
                  </div>
                </div>

                {}
                <button type="submit" className="btn btn-primary w-100 fw-bold py-3 mb-4 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '1.05rem' }}>
                  Sign In
                  <ArrowRight size={18} />
                </button>

                {}
                <p className="text-center small mb-0 text-muted">
                  Don't have an account?{' '}
                  <Link to="/signup" className="fw-bold text-decoration-none" style={{ color: 'var(--accent-primary)' }}>
                    Sign up here
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

