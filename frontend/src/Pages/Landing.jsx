import React from 'react';
import '../Styles/Landing.css';
import { Link } from 'react-router-dom';
import PublicNavbar from '../Components/layout/PublicNavbar';
import Footer from '../Components/layout/Footer';
import { serviceTypes } from '../data/mockData';
import { 
  Car, Clock, Shield, BarChart3, Users, Wrench, 
  ArrowRight, Star, Headphones, CheckCircle2, Sparkles, Zap, Columns, Camera
} from 'lucide-react';

const features = [
  { icon: <Car size={28} />, title: 'Digital Garage', desc: 'Customers can register their vehicles and access a complete, rated service history.' },
  { icon: <Clock size={28} />, title: 'Smart Scheduling', desc: 'Book appointments instantly for diagnostics, routine maintenance, and major repairs.' },
  { icon: <Shield size={28} />, title: 'Live 3-Step Tracking', desc: 'Customers track their vehicle through our Pending, In Progress, and Completed pipeline.' },
  { icon: <BarChart3 size={28} />, title: 'Manager Analytics', desc: 'Shop managers get a bird\'s-eye view of revenue trends, weekly bookings, and team ratings.' },
  { icon: <Columns size={28} />, title: 'Kanban Command Center', desc: 'Managers can seamlessly drag, assign, and oversee active workbays and mechanic workloads.' },
  { icon: <Camera size={28} />, title: 'Mechanic Workspaces', desc: 'Technicians get dedicated digital workspaces to log milestones, attach photos, and complete jobs.' },
];

export default function Landing() {
  return (
    <div className="landing-page-container">
      <PublicNavbar />

      {}
      <section className="landing-hero-section">
        <div className="landing-decorative-orb-top" />
        <div className="landing-decorative-orb-bottom" />
        
        <div className="container position-relative z-1">
          <div className="row align-items-center py-5">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 pe-lg-5">
              
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-hero-badge glass-effect">
                <Sparkles size={16} className="text-accent" />
                <span className="small fw-bold text-accent text-uppercase" style={{ letterSpacing: '0.5px' }}>Precision Shop Management</span>
              </div>
              
              <h1 className="display-4 fw-bold mb-4 text-white" style={{ lineHeight: 1.15, letterSpacing: '-1px' }}>
                The Operating System for <span className="text-accent">Modern Auto Shops.</span>
              </h1>
              
              <p className="lead mb-5 text-muted-light" style={{ fontSize: '1.15rem' }}>
                AutoCare Hub bridges the gap between customers, mechanics, and managers. Book services, assign workloads, and track repairs—all in one high-performance platform.
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/signup" className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center gap-2 px-4 py-3">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <a href="#features" className="btn btn-outline-light btn-lg fw-bold px-4 py-3 d-flex align-items-center justify-content-center">
                  Explore Features
                </a>
              </div>

            </div>
            
            <div className="col-lg-6">
              <div className="landing-hero-image-wrapper">
                <div className="landing-hero-image-glow"></div>
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&h=550&fit=crop"
                  alt="Modern mechanic workshop"
                  className="img-fluid landing-hero-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="features" className="landing-features-section">
        <div className="container">
          <div className="text-center mb-5 pb-3">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-pill">
              <Zap size={14} className="text-accent" />
              <span className="small fw-bold text-accent text-uppercase" style={{ letterSpacing: '0.5px' }}>Platform Capabilities</span>
            </div>
            <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Built for the Entire Shop</h2>
            <p className="lead text-muted-light mx-auto" style={{ maxWidth: '700px' }}>
              Whether you are dropping off your car, turning a wrench, or balancing the books, AutoCare gives you the exact tools you need.
            </p>
          </div>
          
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 landing-feature-card">
                  <div className="card-body p-4 p-xl-5">
                    <div className="d-inline-flex align-items-center justify-content-center mb-4 landing-feature-icon">
                      {f.icon}
                    </div>
                    <h5 className="fw-bold text-white mb-3">{f.title}</h5>
                    <p className="text-muted mb-0 lh-lg">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="services" className="landing-services-section">
        <div className="container">
          <div className="row align-items-end mb-5 pb-3">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 mb-4 landing-pill">
                <Wrench size={14} className="text-accent" />
                <span className="small fw-bold text-accent text-uppercase" style={{ letterSpacing: '0.5px' }}>Service Catalog</span>
              </div>
              <h2 className="fw-bold text-white mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Standardized Repair Menus</h2>
              <p className="lead text-muted-light mb-0">Pre-configured services to keep your bookings consistent and transparent.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/signup" className="btn btn-outline-primary fw-bold">Book a Service Now</Link>
            </div>
          </div>
          
          <div className="row g-4">
            {serviceTypes.map((s) => (
              <div key={s.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 landing-service-card">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-white mb-0">{s.name}</h5>
                      <span className="badge bg-primary text-white fw-bold px-2 py-1 fs-6">${s.price}</span>
                    </div>
                    <p className="small text-muted mb-4">{s.description}</p>
                    <div className="d-flex align-items-center text-accent fw-medium small bg-accent-subtle d-inline-flex px-3 py-2 rounded">
                      <Clock size={14} className="me-2" />
                      Est. Time: {s.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="about" className="landing-trust-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="landing-trust-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=600&fit=crop"
                  alt="Mechanic working on car"
                  className="img-fluid landing-trust-img"
                />
              </div>
            </div>
            <div className="col-lg-7 ps-lg-5">
              <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Built for Scale and Reliability</h2>
              <p className="lead mb-5 text-muted-light">
                AutoCare Hub removes the chaos of paper tickets and endless phone calls. Our system connects your technicians directly to your customers' dashboards.
              </p>
              
              <div className="row g-4">
                {[
                  { num: '500+', label: 'Active Shops', icon: <Wrench size={20} /> },
                  { num: '50k+', label: 'Cars Serviced', icon: <Car size={20} /> },
                  { num: '4.9/5', label: 'Mechanic Rating', icon: <Star size={20} /> },
                  { num: '99%', label: 'Uptime', icon: <Shield size={20} /> },
                ].map((stat, i) => (
                  <div key={i} className="col-6">
                    <div className="p-4 landing-stat-card h-100">
                      <div className="mb-3 text-accent bg-accent-subtle d-inline-flex p-2 rounded">
                        {stat.icon}
                      </div>
                      <h3 className="fw-bold mb-1 text-white">{stat.num}</h3>
                      <p className="small mb-0 text-muted">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="landing-cta-section text-center">
        <div className="landing-cta-orb" />
        <div className="container position-relative z-1 py-5">
          <div className="bg-accent-subtle text-accent d-inline-flex p-3 rounded-circle mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Ready to Modernize?</h2>
          <p className="lead mb-5 text-muted-light mx-auto" style={{ maxWidth: '600px' }}>
            Join the platform that is changing how auto repair shops communicate, organize, and grow.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg fw-bold px-5 py-3 d-flex align-items-center gap-2">
              Create Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

