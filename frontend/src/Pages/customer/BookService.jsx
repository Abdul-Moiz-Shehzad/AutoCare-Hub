import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import { mockVehicles, serviceTypes } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  CheckCircle2, RotateCcw
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

const BookService = () => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBook = (e) => {
    e.preventDefault();
    setBooked(true);
  };

  // Success Screen
  if (booked) {
    return (
      <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 book-success-container">
          <div className="d-flex align-items-center justify-content-center mb-4 booking-success-icon">
            <CheckCircle2 size={40} className="book-service-icon-success" style={{ color: 'var(--color-success)' }} />
          </div>
          <h2 className="fw-bold mb-2 text-primary-custom">Service Booked!</h2>
          <p className="mb-4 text-secondary-custom">Your service request has been submitted. We'll notify you when it's confirmed.</p>
          <button onClick={() => setBooked(false)} className="btn btn-primary px-4 py-2 fw-medium d-flex align-items-center gap-2">
            <RotateCcw size={16} />
            Book Another Service
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Book a Service"
        description="Select a service type and schedule your appointment."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'Book Service' }]}
      />

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          
          {/* Step 1: Select Service Type */}
          <div className="card border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-primary-custom">Select Service Type</h5>
              <div className="row g-3">
                {serviceTypes.map((s) => (
                  <div className="col-md-6" key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedService(s.id)}
                        className={`btn w-100 h-100 text-start p-3 service-select-card ${selectedService === s.id ? 'active' : ''}`}
                      >
                        <div className="fw-bold" style={{ color: selectedService === s.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{s.name}</div>
                        <div className="small mt-1 text-secondary-custom">{s.description}</div>
                        <div className="d-flex align-items-center gap-2 mt-2 small">
                          <span className="fw-bold text-primary-custom">${s.price}</span>
                          <span className="text-muted-custom">• {s.duration}</span>
                        </div>
                      </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Booking Details */}
          <div className="card border-0">
            <div className="card-body p-4">
              <form onSubmit={handleBook}>
                <h5 className="fw-bold mb-4 text-primary-custom">Booking Details</h5>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-medium small text-secondary-custom">Vehicle</label>
                    <select 
                      className="form-select" 
                      value={selectedVehicle} 
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select vehicle</option>
                      {mockVehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small text-secondary-custom">Preferred Date</label>
                    <input type="date" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small text-secondary-custom">Preferred Time</label>
                    <input type="time" className="form-control" required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium small text-secondary-custom">Additional Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Describe any issues or special requests..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 position-sticky book-summary-sticky">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-primary-custom">Booking Summary</h5>
              
              {selectedService ? (
                (() => {
                  const st = serviceTypes.find(s => s.id === selectedService);
                  const veh = mockVehicles.find(v => v.id === selectedVehicle);
                  return (
                    <div className="d-flex flex-column gap-3 small">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted-custom">Service</span>
                        <span className="fw-medium text-primary-custom">{st?.name}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted-custom">Duration</span>
                        <span className="text-secondary-custom">{st?.duration}</span>
                      </div>
                      {veh && (
                        <div className="d-flex justify-content-between">
                          <span className="text-muted-custom">Vehicle</span>
                          <span className="text-secondary-custom">{veh.make} {veh.model}</span>
                        </div>
                      )}
                      <hr className="book-divider" />
                      <div className="d-flex justify-content-between fw-bold fs-6">
                        <span className="text-primary-custom">Total</span>
                        <span className="accent-gradient-text">${st?.price}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="small mb-0 text-muted-custom">Select a service to see summary.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default BookService;