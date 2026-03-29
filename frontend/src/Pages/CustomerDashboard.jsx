import React, { useState } from 'react';
import '../Styles/CustomerDashboard.css';

const CustomerDashboard = () => {
    // Reactive state for UI data (Slide: State Management)
    const [activeService] = useState({
        name: "Audi RS6 Performance",
        ref: "#SRV-99201",
        eta: "Today, 4:00 PM",
        currentStep: 2
    });

    return (
        <div className="customer-dashboard-wrapper">
            {/* Sidebar Shell - Semantic Aside */}
            <aside className="customer-sidebar">
                <div style={{ padding: '0 24px', marginBottom: '40px' }}>
                    <div className="customer-flex customer-items-center customer-gap-3">
                        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--customer-primary-container)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--customer-on-primary-container)' }}>build</span>
                        </div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: 'bold', fontSize: '18px', color: '#c0c1ff', textTransform: 'uppercase' }}>AutoCare Hub</span>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <a href="#" className="customer-flex customer-items-center customer-gap-3" style={{ backgroundColor: '#1B1B1E', color: '#C0C1FF', padding: '12px 16px', margin: '4px 8px', borderRadius: '8px', borderLeft: '4px solid #4E4FEB', textDecoration: 'none' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>dashboard</span>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.1em' }}>Overview</span>
                    </a>
                    {/* Add more nav items here */}
                </nav>
                
                <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button style={{ width: '100%', backgroundColor: 'var(--customer-primary-container)', color: 'var(--customer-on-primary-container)', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', border: 'none', cursor: 'pointer' }}>
                        New Service
                    </button>
                </div>
            </aside>

            {/* Main Content - Semantic Main */}
            <main className="customer-main-content">
                <header className="customer-header">
                    <div>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>DASHBOARD</h1>
                        <p style={{ fontSize: '12px', color: 'var(--customer-outline)', margin: 0 }}>Welcome back, Marcus.</p>
                    </div>
                    <div className="customer-flex customer-items-center customer-gap-3">
                        <span className="material-symbols-outlined" style={{ color: 'var(--customer-outline)', cursor: 'pointer' }}>notifications</span>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#2a2a2d', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--customer-primary)' }}>person</span>
                        </div>
                    </div>
                </header>

                <div className="customer-stats-grid">
                    {/* Active Services Card */}
                    <div className="customer-card">
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--customer-outline)', textTransform: 'uppercase', marginBottom: '8px' }}>Active Services</p>
                        <div className="customer-flex customer-items-center customer-gap-3">
                            <span className="customer-stat-value">02</span>
                            <span style={{ fontSize: '12px', color: 'rgba(192, 193, 255, 0.6)' }}>+1 since yesterday</span>
                        </div>
                    </div>

                    {/* Progress Tracker Section */}
                    <div className="customer-card" style={{ gridColumn: 'span 2', backgroundColor: 'var(--customer-surface-container)' }}>
                        <div className="customer-flex customer-justify-between">
                            <div>
                                <span style={{ padding: '2px 8px', backgroundColor: 'rgba(78, 79, 235, 0.2)', color: '#c0c1ff', fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', textTransform: 'uppercase' }}>In Progress</span>
                                <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>{activeService.name}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--customer-outline)', margin: 0 }}>Ref: {activeService.ref}</p>
                            </div>
                        </div>

                        {/* Flexbox Stepper - Aligned with Slides */}
                        <div className="customer-stepper-container">
                            <div className="customer-step-line"></div>
                            <div className="customer-step-line" style={{ width: '50%', backgroundColor: 'var(--customer-primary)' }}></div>
                            
                            {[
                                { icon: 'check', label: 'Inspection' },
                                { icon: 'build', label: 'Repair' },
                                { icon: 'verified', label: 'Final Check' },
                                { icon: 'flag', label: 'Ready' }
                            ].map((step, index) => (
                                <div key={index} className="customer-flex customer-flex-col customer-items-center" style={{ zIndex: 10 }}>
                                    <div className={`customer-step-dot ${index <= activeService.currentStep ? 'active' : ''}`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{step.icon}</span>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '12px' }}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;