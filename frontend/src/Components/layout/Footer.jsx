import React from 'react';
import { Wrench, Globe, ExternalLink, Mail } from 'lucide-react';
import '../../Styles/Components.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
              <div className="footer-icon-wrapper">
                <Wrench size={16} color="var(--accent-primary)" />
              </div>
              <span className="fw-bold footer-text-primary">AutoCare Hub</span>
            </div>
          </div>
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <p className="mb-0 small footer-text-muted">
              &copy; {new Date().getFullYear()} AutoCare Hub. All rights reserved.
            </p>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex gap-3 justify-content-center justify-content-md-end">
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <button key={i} className="d-flex align-items-center justify-content-center border-0 footer-social-btn">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

