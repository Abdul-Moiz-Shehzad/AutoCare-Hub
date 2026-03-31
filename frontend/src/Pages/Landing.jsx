import React from 'react';
import '../Styles/Landing.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../Components/layout/PublicNavbar';
import Footer from '../Components/layout/Footer';
import { serviceTypes } from '../data/mockData';
import { 
  Car, Clock, Shield, BarChart3, Users, Wrench, 
  ArrowRight, Star, Headphones, CheckCircle2, Sparkles, Zap, Settings
} from 'lucide-react';

const features = [
  { icon: <Car size={28} />, title: 'Vehicle Management', desc: 'Register and manage all your vehicles in one place with complete service history.' },
  { icon: <Clock size={28} />, title: 'Easy Scheduling', desc: 'Book services online with flexible time slots and instant confirmation.' },
  { icon: <Shield size={28} />, title: 'Real-Time Tracking', desc: 'Track your service progress from drop-off to completion in real time.' },
  { icon: <BarChart3 size={28} />, title: 'Analytics Dashboard', desc: 'Comprehensive reporting and insights for service managers.' },
  { icon: <Users size={28} />, title: 'Team Management', desc: 'Assign mechanics, manage workloads, and optimize workflow.' },
  { icon: <Wrench size={28} />, title: 'Service Catalog', desc: 'Browse our complete range of maintenance and repair services.' },
];



const Landing = () => {
  return (
    <div className="landing-page-container">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="landing-hero-section">
        {/* Decorative background elements */}
        <div className="landing-decorative-orb-top" />
        <div className="landing-decorative-orb-bottom" />
        
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-hero-badge">
                <Sparkles size={14} className="auth-text-accent" />
                <span className="small fw-medium auth-text-accent">AI-Powered Service Management</span>
              </div>
              <h1 className="display-4 fw-bold mb-4 auth-text-primary" style={{ lineHeight: 1.15 }}>
                Professional Vehicle Service{' '}
                <span className="accent-gradient-text">Made Simple</span>
              </h1>
              <p className="lead mb-4 auth-text-secondary" style={{ fontSize: '1.15rem' }}>
                Book, track, and manage vehicle maintenance with AutoCare Hub — the all-in-one platform for customers, mechanics, and service managers.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/signup" className="btn btn-primary btn-lg d-flex align-items-center gap-2 px-4">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <a href="#features" className="btn btn-outline-light btn-lg px-4">
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="landing-hero-image">
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=500&fit=crop"
                  alt="Modern mechanic workshop"
                  className="img-fluid w-100 d-block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features-section">
        <div className="container text-center">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-pill-muted">
            <Zap size={14} className="auth-text-accent" />
            <span className="small fw-medium auth-text-accent">Features</span>
          </div>
          <h2 className="fw-bold mb-4 auth-text-primary" style={{ fontSize: '2.5rem' }}>Everything You Need</h2>
          <p className="lead mb-5 auth-text-secondary" style={{ fontSize: '1.25rem' }}>Powerful features to manage your vehicle service operations efficiently.</p>
          
          <div className="row g-5">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 landing-feature-card">
                  <div className="card-body p-5 text-center">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3 landing-feature-icon">
                      {f.icon}
                    </div>
                    <h5 className="fw-bold auth-text-primary">{f.title}</h5>
                    <p className="auth-text-secondary">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="landing-services-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-pill-muted">
              <Wrench size={14} className="auth-text-accent" />
              <span className="small fw-medium auth-text-accent">Services</span>
            </div>
            <h2 className="fw-bold mb-4 auth-text-primary" style={{ fontSize: '2.5rem' }}>Our Services</h2>
            <p className="lead auth-text-secondary" style={{ fontSize: '1.25rem' }}>Comprehensive vehicle maintenance and repair services.</p>
          </div>
          
          <div className="row g-5">
            {serviceTypes.map((s) => (
              <div key={s.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-5 d-flex align-items-start gap-4">
                    <div className="d-flex align-items-center justify-content-center landing-service-icon">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-2 auth-text-primary">{s.name}</h5>
                      <p className="small mb-3 auth-text-secondary">{s.description}</p>
                      <div className="d-flex align-items-center fw-bold auth-text-primary">
                        <span>${s.price}</span>
                        <span className="mx-2 auth-text-muted">•</span>
                        <span className="auth-text-muted">{s.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / About Section */}
      <section id="about" className="landing-trust-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5 text-center">
              <div className="landing-trust-image">
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=450&fit=crop"
                  alt="Mechanic working on car"
                  className="img-fluid w-100 d-block"
                />
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-start">
              <h2 className="fw-bold mb-4 auth-text-primary" style={{ fontSize: '2.5rem' }}>Trusted by Service Centers Nationwide</h2>
              <p className="lead mb-5 auth-text-secondary" style={{ fontSize: '1.25rem' }}>
                AutoCare Hub streamlines operations for over 500 service centers, helping them deliver exceptional customer experiences with powerful management tools.
              </p>
              
              <div className="row g-4 text-center">
                {[
                  { num: '500+', label: 'Service Centers', icon: <Wrench size={18} /> },
                  { num: '50,000+', label: 'Vehicles Serviced', icon: <Car size={18} /> },
                  { num: '98%', label: 'Customer Satisfaction', icon: <Star size={18} /> },
                  { num: '24/7', label: 'Support Available', icon: <Headphones size={18} /> },
                ].map((stat, i) => (
                  <div key={i} className="col-6">
                    <div className="p-4 landing-stat-card">
                      <div className="d-flex align-items-center justify-content-center mb-2 auth-text-accent">
                        {stat.icon}
                      </div>
                      <h3 className="fw-bold mb-1 accent-gradient-text">{stat.num}</h3>
                      <p className="small mb-0 auth-text-muted">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta-section">
        {/* Decorative glow */}
        <div className="landing-cta-orb" />
        <div className="container position-relative z-1">
          <CheckCircle2 size={48} className="auth-text-accent" style={{ marginBottom: '1rem' }} />
          <h2 className="fw-bold mb-3 auth-text-primary" style={{ fontSize: '2rem' }}>Ready to Get Started?</h2>
          <p className="lead mb-4 auth-text-secondary">Join thousands of vehicle owners and service professionals.</p>
          <Link to="/signup" className="btn btn-primary btn-lg fw-bold d-inline-flex align-items-center gap-2 px-4">
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;