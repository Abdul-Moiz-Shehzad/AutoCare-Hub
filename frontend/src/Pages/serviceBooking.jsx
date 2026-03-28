import React, { useState } from 'react';
import '../Styles/serviceBooking.css';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const ScheduleService = () => {
    const [selectedService, setSelectedService] = useState('Brake Inspection');
    const [selectedDate, setSelectedDate] = useState(11);
    const [selectedTime, setSelectedTime] = useState('10:00 AM');

    return (
        <div className="d-flex" data-bs-theme="dark">
            <Sidebar />

            <main className="main-content w-100">
                <Navbar />

                <div className="position-relative h-100">
                    <div className="grainy-surface"></div>

                    <div className="container-fluid px-5 py-5" style={{ position: 'relative', zIndex: 10 }}>
                    <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
                        <div>
                            <h1 className="font-headline display-6 fw-bold text-white mb-2">Schedule Service</h1>
                            <p className="text-secondary fw-medium mb-0">Precision maintenance for your high-performance machines.</p>
                        </div>
                        <div className="d-flex align-items-center gap-3 text-xxs font-monospace text-primary-accent bg-surface-low px-3 py-2 rounded" style={{ border: '1px solid var(--border-color)' }}>
                            <span className="opacity-50">STATION:</span>
                            <span>WS-04-NORTH</span>
                        </div>
                    </header>

                    <div className="row g-4">
                        <section className="col-12 col-lg-7 d-flex flex-column gap-4">
                            <div className="bg-surface-low p-4 rounded-4 position-relative overflow-hidden group">
                                <i className="bi bi-car-front-fill position-absolute text-secondary" style={{ fontSize: '5rem', top: '-10px', right: '10px', opacity: 0.1 }}></i>
                                <label className="d-block font-headline text-xxs text-uppercase tracking-widest text-primary-accent mb-3">01. Select Vehicle</label>
                                <div className="custom-select-wrapper">
                                    <select className="form-select custom-form-element shadow-none appearance-none">
                                        <option>2023 Porsche 911 GT3 (B-8821-XP)</option>
                                        <option>2021 Audi RS6 Avant (K-1092-LL)</option>
                                        <option>2024 Tesla Model S Plaid (E-4420-VV)</option>
                                    </select>
                                    <i className="bi bi-chevron-down"></i>
                                </div>
                            </div>

                            <div className="bg-surface-low p-4 rounded-4">
                                <label className="d-block font-headline text-xxs text-uppercase tracking-widest text-primary-accent mb-4">02. Choose Service Type</label>
                                <div className="row g-3">
                                    {[
                                        { name: 'Oil Change', desc: 'Synthetic Performance', icon: 'bi-droplet-fill' },
                                        { name: 'Brake Inspection', desc: 'Calibration & Wear Check', icon: 'bi-shield-fill-check', bgIcon: 'bi-plugin' },
                                        { name: 'Full Detailing', desc: 'Ceramic Coating Ready', icon: 'bi-stars' },
                                        { name: 'Engine Tune-up', desc: 'ECU Remapping', icon: 'bi-lightning-charge-fill' }
                                    ].map((service) => {
                                        const isActive = selectedService === service.name;
                                        return (
                                            <div key={service.name} className="col-12 col-sm-6">
                                                <button 
                                                    className={`btn w-100 text-start p-3 rounded-3 position-relative overflow-hidden ${isActive ? 'service-btn-active' : 'service-btn'}`}
                                                    onClick={() => setSelectedService(service.name)}
                                                >
                                                    {service.bgIcon && isActive && (
                                                        <i className={`bi ${service.bgIcon} position-absolute`} style={{ fontSize: '5rem', right: '-10px', top: '-10px', opacity: 0.1, color: 'white' }}></i>
                                                    )}
                                                    <i className={`bi ${service.icon} fs-4 mb-2 d-block ${isActive ? 'text-on-primary-container' : 'text-primary-accent'}`}></i>
                                                    <span className={`font-headline fs-6 fw-bold d-block ${isActive ? 'text-on-primary-container' : 'text-white'}`}>{service.name}</span>
                                                    <span className={`text-xxs text-uppercase d-block mt-1 ${isActive ? 'text-on-primary-container opacity-75' : 'text-secondary'}`}>{service.desc}</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-surface-low p-4 rounded-4">
                                <label className="d-block font-headline text-xxs text-uppercase tracking-widest text-primary-accent mb-3">04. Mechanic Instructions</label>
                                <textarea className="form-control custom-form-element shadow-none" style={{ height: '120px', resize: 'none' }} placeholder="Specify any unusual noises or specific concerns..."></textarea>
                            </div>
                        </section>

                        <section className="col-12 col-lg-5 d-flex flex-column gap-4">
                            <div className="bg-surface-low p-4 rounded-4 h-100 d-flex flex-column">
                                <label className="d-block font-headline text-xxs text-uppercase tracking-widest text-primary-accent mb-4">03. Select Date</label>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="font-headline h5 fw-bold text-white mb-0">October 2024</h3>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-sm text-light bg-surface-container"><i className="bi bi-chevron-left"></i></button>
                                            <button className="btn btn-sm text-light bg-surface-container"><i className="bi bi-chevron-right"></i></button>
                                        </div>
                                    </div>

                                    <div className="calendar-grid mb-2">
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Mon</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Tue</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Wed</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Thu</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Fri</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Sat</span>
                                        <span className="text-xxs fw-bold text-secondary text-uppercase tracking-tighter">Sun</span>
                                    </div>

                                    <div className="calendar-grid">
                                        <button className="calendar-btn inactive">28</button>
                                        <button className="calendar-btn inactive">29</button>
                                        <button className="calendar-btn inactive">30</button>
                                        {Array.from({length: 15}, (_, i) => i + 1).map(day => (
                                            <button 
                                                key={day} 
                                                className={`calendar-btn ${selectedDate === day ? 'active' : ''}`}
                                                onClick={() => setSelectedDate(day)}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                        <span className="calendar-btn inactive">...</span>
                                    </div>

                                    <div className="mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
                                        <h4 className="font-headline text-xxs text-uppercase tracking-widest text-secondary mb-3">Available Slots</h4>
                                        <div className="d-flex flex-wrap gap-2">
                                            {['08:30 AM', '10:00 AM', '01:30 PM', '04:00 PM'].map(time => (
                                                <button 
                                                    key={time} 
                                                    className={`btn btn-sm time-slot px-3 ${selectedTime === time ? 'active' : ''}`}
                                                    onClick={() => setSelectedTime(time)}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button className="btn bg-primary-container text-on-primary-container w-100 font-headline fw-bold text-uppercase py-3 mt-4 d-flex align-items-center justify-content-center gap-2" style={{ letterSpacing: '0.1em', boxShadow: '0 8px 32px rgba(78,79,235,0.4)' }}>
                                    Schedule Service
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </button>
                            </div>
                        </section>
                    </div>

                    <div className="row g-4 mt-4">
                        <div className="col-12 col-md-4">
                            <div className="bg-surface-container p-3 rounded d-flex align-items-center gap-3 border-custom">
                                <div className="p-2 rounded" style={{ backgroundColor: 'rgba(187, 45, 91, 0.2)' }}>
                                    <i className="bi bi-patch-check-fill text-tertiary fs-5"></i>
                                </div>
                                <div>
                                    <p className="text-xxs text-secondary text-uppercase tracking-widest mb-0">Technician Rank</p>
                                    <p className="font-headline fw-bold text-white mb-0">Master Certified</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="bg-surface-container p-3 rounded d-flex align-items-center gap-3 border-custom">
                                <div className="p-2 rounded" style={{ backgroundColor: 'rgba(78, 79, 235, 0.2)' }}>
                                    <i className="bi bi-stopwatch-fill text-primary-accent fs-5"></i>
                                </div>
                                <div>
                                    <p className="text-xxs text-secondary text-uppercase tracking-widest mb-0">Est. Duration</p>
                                    <p className="font-headline fw-bold text-white mb-0">45 - 60 Minutes</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="bg-surface-container p-3 rounded d-flex align-items-center gap-3 border-custom">
                                <div className="p-2 rounded bg-dark">
                                    <i className="bi bi-receipt text-secondary fs-5"></i>
                                </div>
                                <div>
                                    <p className="text-xxs text-secondary text-uppercase tracking-widest mb-0">Service Cost</p>
                                    <p className="font-headline fw-bold text-white mb-0">TBD After Intake</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="row mt-5 pt-5 border-top text-center text-md-start" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="col-12 col-md-4 mb-4 mb-md-0">
                            <h3 className="h6 fw-bold text-light font-headline mb-3">AutoCare Hub</h3>
                            <p className="text-secondary text-xxs lh-lg">2024 AutoCare Hub. All rights reserved. Precision management for the automotive elite.</p>
                        </div>
                        <div className="col-12 col-md-4 mb-4 mb-md-0 d-flex flex-column gap-2">
                            <h4 className="text-xxs text-uppercase tracking-widest text-primary-accent fw-bold mb-2">Legal & Tech</h4>
                            <a className="text-secondary text-decoration-none text-xxs hover-text-white" href="#!">Privacy Policy</a>
                            <a className="text-secondary text-decoration-none text-xxs hover-text-white" href="#!">Terms of Service</a>
                            <a className="text-secondary text-decoration-none text-xxs hover-text-white" href="#!">API Docs</a>
                        </div>
                        <div className="col-12 col-md-4 d-flex flex-column gap-2">
                            <h4 className="text-xxs text-uppercase tracking-widest text-primary-accent fw-bold mb-2">Support</h4>
                            <a className="text-secondary text-decoration-none text-xxs hover-text-white" href="#!">Contact Support</a>
                            <a className="text-secondary text-decoration-none text-xxs hover-text-white" href="#!">Knowledge Base</a>
                            <div className="mt-3 d-flex gap-3 justify-content-center justify-content-md-start">
                                <i className="bi bi-share-fill text-secondary" style={{ cursor: 'pointer' }}></i>
                                <i className="bi bi-envelope-fill text-secondary" style={{ cursor: 'pointer' }}></i>
                            </div>
                        </div>
                    </footer>
                </div>
                </div>
            </main>
        </div>
    );
};

export default ScheduleService;