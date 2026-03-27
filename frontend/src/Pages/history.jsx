import React, { useState } from 'react';
import '../Styles/history.css';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const AutoCareHub = () => {
    const [activeTab, setActiveTab] = useState('Ongoing Progress');

    return (
        <div className="d-flex" data-bs-theme="dark">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="main-content w-100">
                <Navbar />

                <div className="container-fluid px-5 py-5">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4 mb-5">
                        <div>
                            <span className="text-accent fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.3em' }}>Workshop Diagnostics</span>
                            <h1 className="display-5 fw-bold text-light font-headline mb-0">Vehicle Management</h1>
                        </div>
                        <div className="bg-surface-low p-1 rounded d-flex">
                            <button 
                                className={`btn text-uppercase rounded me-1 ${activeTab === 'Ongoing Progress' ? 'btn-dark text-accent fw-bold shadow' : 'text-secondary fw-bold'}`} 
                                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                                onClick={() => setActiveTab('Ongoing Progress')}
                            >
                                Ongoing Progress
                            </button>
                            <button 
                                className={`btn text-uppercase rounded ${activeTab === 'Maintenance Records' ? 'btn-dark text-accent fw-bold shadow' : 'text-secondary fw-bold'}`} 
                                style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
                                onClick={() => setActiveTab('Maintenance Records')}
                            >
                                Maintenance Records
                            </button>
                        </div>
                    </div>

                    <div className="row g-5 mb-5">
                        {/* Left Column: Active Session */}
                        <div className="col-lg-8">
                            <div className="bg-surface-low rounded border p-4 position-relative shadow" style={{ borderColor: 'var(--border-color)' }}>
                                <span className="badge bg-primary-subtle text-primary border border-primary position-absolute top-0 end-0 m-4 p-2 text-uppercase" style={{ letterSpacing: '0.1em' }}>Active Session</span>

                                <div className="d-flex gap-4 mb-5">
                                    <div className="rounded border border-secondary overflow-hidden" style={{ width: '130px', height: '130px', backgroundColor: 'var(--surface-container)' }}>
                                        <img alt="Vehicle preview" className="w-100 h-100 object-fit-cover opacity-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7OEb6gN7tWxb9X6KuiCZWYUhbrrQOW5wDxF7_DU8PbWciA38bU9WbfuP8lVRzRKKY_pcnjCJP9rVwrhrCsIdiXXSfiGwWmjZBESH-GF-WvMzga18oEzlRM-YEyuQy0VEoGCv1WsB2wvQ1MxBEIy4doZhaSvqWsMYWbOBQPlOcYiDJw3WhKZaY3sJ7y09LtdCFAlV7_7ND6wvbwQK5WcVsXZvH8F1eet9oTHLUA9SNRgQNGouC9hzZ031cHvtq3KQFfC8GWZl16AE" />
                                    </div>
                                    <div className="pt-2">
                                        <h3 className="h4 fw-bold font-headline text-white mb-1">2023 Porsche Taycan 4S</h3>
                                        <p className="text-secondary small text-uppercase mb-3" style={{ letterSpacing: '0.1em' }}>VIN: WP0AA2Y1XNSA00XXX</p>
                                        <div className="d-flex gap-2">
                                            <span className="badge bg-dark border text-secondary p-2"><i className="bi bi-lightning-charge-fill me-1"></i> Electric</span>
                                            <span className="badge bg-dark border text-secondary p-2"><i className="bi bi-speedometer2 me-1"></i> 12,450 MI</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <div className="d-flex justify-content-between align-items-end mb-2">
                                        <div className="text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.1em' }}>
                                            <span className="spinner-grow spinner-grow-sm text-primary me-2" role="status"></span>Diagnostic Completion
                                        </div>
                                        <span className="h3 fw-bold font-headline text-accent mb-0">74%</span>
                                    </div>
                                    <div className="progress progress-custom rounded-pill">
                                        <div className="progress-bar progress-bar-custom rounded-pill" role="progressbar" style={{ width: '74%' }} aria-valuenow="74" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>

                                <div className="bg-surface-container border rounded p-4 d-flex gap-3 align-items-center" style={{ borderColor: 'var(--border-color)' }}>
                                    <div className="bg-dark rounded d-flex align-items-center justify-content-center border border-secondary" style={{ width: '50px', height: '50px' }}>
                                        <i className="bi bi-person-workspace text-accent fs-4"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Mechanic Direct Note</span>
                                            <span className="text-secondary" style={{ fontSize: '0.65rem' }}>2 MINUTES AGO</span>
                                        </div>
                                        <p className="text-light small fst-italic mb-0">"Cell #42 showed slight voltage variance; performing localized discharge. Should be wrapped up in 45 mins."</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Telemetry & Maintenance */}
                        <div className="col-lg-4 d-flex flex-column gap-4">
                            <div className="bg-surface-low rounded border p-4 shadow" style={{ borderColor: 'var(--border-color)' }}>
                                <h4 className="text-accent fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                                    <i className="bi bi-broadcast me-2"></i> Live Telemetry
                                </h4>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                                        <span className="text-secondary small text-uppercase fw-bold">Brake Wear</span>
                                        <span className="text-light fw-bold font-headline">12% / 15%</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                                        <span className="text-secondary small text-uppercase fw-bold">Tire PSI (FL/FR)</span>
                                        <span className="text-light fw-bold font-headline">32.4 / 32.1</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                                        <span className="text-secondary small text-uppercase fw-bold">Software Version</span>
                                        <span className="text-accent fw-bold font-headline">V4.2.0-PRO</span>
                                    </div>
                                    <button className="btn btn-outline-secondary w-100 mt-2 text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>Download Full Diagnostic Report</button>
                                </div>
                            </div>

                            <div className="bg-surface-low rounded border p-4 shadow" style={{ borderColor: 'var(--border-color)' }}>
                                <h4 className="text-secondary fw-bold text-uppercase mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>Upcoming Maintenance</h4>
                                <div className="d-flex flex-column gap-3">
                                    <div className="bg-surface-container rounded p-3 d-flex align-items-center gap-3 border border-dark">
                                        <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-vinyl-fill text-danger fs-5"></i>
                                        </div>
                                        <div>
                                            <p className="text-light fw-bold text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Tire Rotation</p>
                                            <p className="text-secondary text-uppercase mb-0" style={{ fontSize: '0.65rem' }}>In 2,500 Miles</p>
                                        </div>
                                    </div>
                                    <div className="bg-surface-container rounded p-3 d-flex align-items-center gap-3 border border-dark">
                                        <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <i className="bi bi-funnel-fill text-accent fs-5"></i>
                                        </div>
                                        <div>
                                            <p className="text-light fw-bold text-uppercase mb-0" style={{ fontSize: '0.8rem' }}>Cabin Filter</p>
                                            <p className="text-secondary text-uppercase mb-0" style={{ fontSize: '0.65rem' }}>August 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Records Table */}
                    <div className="mt-5 pt-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                            <div>
                                <h3 className="h4 fw-bold font-headline text-white mb-1">Maintenance Records</h3>
                                <p className="text-secondary small mb-0">Full encrypted service history for all authenticated workshop visits.</p>
                            </div>
                            <div className="d-flex gap-3 mt-3 mt-md-0">
                                <input
                                    className="form-control bg-surface-container border-secondary text-light rounded"
                                    placeholder="Filter by operation..."
                                    type="text"
                                    style={{ width: '200px', fontSize: '0.8rem' }}
                                />
                                <button
                                    className="btn bg-surface-low text-secondary border border-secondary text-uppercase fw-bold d-flex align-items-center gap-2"
                                    style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                                >
                                    <i className="bi bi-filter"></i> Filter
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive rounded border shadow" style={{ borderColor: 'var(--border-color)' }}>
                            <table className="table table-dark table-hover align-middle mb-0">
                                <thead className="bg-dark">
                                    <tr>
                                        <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Service Date</th>
                                        <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Operation</th>
                                        <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Facility</th>
                                        <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Cost</th>
                                        <th className="py-3 px-4 text-secondary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>Invoices</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-3 px-4">
                                            <p className="mb-0 fw-bold font-headline text-light">Jan 12, 2024</p>
                                            <p className="mb-0 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>12,102 MI</p>
                                        </td>
                                        <td className="py-3 px-4"><span className="text-light small">Software Update v4.1 & Brake Pad Check</span></td>
                                        <td className="py-3 px-4"><span className="badge text-bg-success">Main Workshop</span></td>
                                        <td className="py-3 px-4"><span className="fw-bold font-headline text-light">$245.00</span></td>
                                        <td className="py-3 px-4">
                                            <button className="btn btn-link text-accent text-decoration-none text-uppercase fw-bold p-0" style={{ fontSize: '0.65rem' }}>
                                                <i className="bi bi-download me-1"></i> PDF Invoice
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">
                                            <p className="mb-0 fw-bold font-headline text-light">Nov 04, 2023</p>
                                            <p className="mb-0 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>10,440 MI</p>
                                        </td>
                                        <td className="py-3 px-4"><span className="text-light small">Annual Safety Inspection & Alignment</span></td>
                                        <td className="py-3 px-4"><span className="badge text-bg-success">Southside Hub</span></td>
                                        <td className="py-3 px-4"><span className="fw-bold font-headline text-light">$180.00</span></td>
                                        <td className="py-3 px-4">
                                            <button className="btn btn-link text-accent text-decoration-none text-uppercase fw-bold p-0" style={{ fontSize: '0.65rem' }}>
                                                <i className="bi bi-download me-1"></i> PDF Invoice
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AutoCareHub;