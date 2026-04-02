import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import { mockVehicles, serviceTypes } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  CheckCircle2, RotateCcw, Droplets, Disc, CircleDashed, 
  Wind, Sparkles, Wrench, Settings, Zap
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

const getServiceIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('oil')) return <Droplets size={24} />;
  if (lowerName.includes('brake')) return <Disc size={24} />;
  if (lowerName.includes('tire') || lowerName.includes('rotation')) return <CircleDashed size={24} />;
  if (lowerName.includes('engine') || lowerName.includes('diagnostic')) return <Activity size={24} />;
  if (lowerName.includes('ac ') || lowerName.includes('air')) return <Wind size={24} />;
  if (lowerName.includes('detail') || lowerName.includes('wash')) return <Sparkles size={24} />;
  if (lowerName.includes('full') || lowerName.includes('service')) return <Wrench size={24} />;
  return <Settings size={24} />;
};

const BookService = () => {
  // Changed to an array to handle multiple selections
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [booked, setBooked] = useState(false);

  // Toggle function for multi-select
  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(serviceId => serviceId !== id) // Remove if already selected
        : [...prev, id] // Add if not selected
    );
  };

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
          <button 
            onClick={() => {
              setBooked(false);
              setSelectedServices([]); // Reset selections on book again
            }} 
            className="btn btn-primary px-4 py-2 fw-medium d-flex align-items-center gap-2"
          >
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
        description="Select the services you need and schedule your appointment."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'Book Service' }]}
      />

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          
          {/* Step 1: Select Service Types (Multi-Select) */}
          <div className="mb-5"> 
            <h5 className="fw-bold mb-4 text-secondary text-uppercase" style={{fontSize: '0.8rem', letterSpacing: '1px'}}>
              01. Choose Services (Select Multiple)
            </h5>
            <div className="row g-3">
              {serviceTypes.map((s) => {
                const isSelected = selectedServices.includes(s.id);
                return (
                  <div className="col-md-6" key={s.id}>
                      <button
                        type="button"
                        onClick={() => toggleService(s.id)}
                        className={`btn w-100 h-100 text-start p-4 service-select-card ${isSelected ? 'active' : ''}`}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="service-icon">{getServiceIcon(s.name)}</div>
                          {/* Shows a checkmark in the corner when active */}
                          {isSelected && <CheckCircle2 size={20} className="text-white" />}
                        </div>
                        <div className="fw-bold fs-5 service-title">{s.name}</div>
                        <div className="small mt-1 text-uppercase service-desc">{s.description}</div>
                        
                        <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-opacity-10 service-meta">
                          <span className="fw-bold">${s.price}</span>
                          <span className="opacity-75">• {s.duration}</span>
                        </div>
                      </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Booking Details */}
          <div className="card border-0 mt-5">
            <div className="card-body p-4">
              <form onSubmit={handleBook}>
                <h5 className="fw-bold mb-4 text-secondary text-uppercase" style={{fontSize: '0.8rem', letterSpacing: '1px'}}>
                  02. Mechanic Instructions & Details
                </h5>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-12">
                    <label className="form-label fw-medium small text-secondary-custom">Vehicle</label>
                    <select 
                      className="form-select p-3" 
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
                    <input type="date" className="form-control p-3" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small text-secondary-custom">Preferred Time</label>
                    <input type="time" className="form-control p-3" required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium small text-secondary-custom">Additional Notes</label>
                  <textarea 
                    className="form-control p-3" 
                    rows="3" 
                    placeholder="Specify any unusual noises or specific concerns..."
                  ></textarea>
                </div>

                {/* Disabled if no services are selected */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 fw-bold py-3 mt-2"
                  disabled={selectedServices.length === 0}
                >
                  Confirm Booking <Zap size={16} className="ms-2" />
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
              
              {selectedServices.length > 0 ? (
                (() => {
                  // Get full objects for selected services
                  const selectedTypes = selectedServices
                    .map(id => serviceTypes.find(s => s.id === id))
                    .filter(Boolean);
                  
                  const veh = mockVehicles.find(v => v.id === selectedVehicle);
                  
                  // Calculate total price
                  const totalPrice = selectedTypes.reduce((sum, st) => sum + Number(st.price), 0);

                  return (
                    <div className="d-flex flex-column gap-3 small">
                      
                      <div className="d-flex flex-column gap-2 mb-2">
                        <span className="text-muted-custom mb-1 text-uppercase" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Selected Services</span>
                        {selectedTypes.map(st => (
                          <div key={st.id} className="d-flex justify-content-between align-items-center">
                            <span className="fw-medium text-primary-custom d-flex align-items-center gap-2">
                              <CheckCircle2 size={14} className="text-success" />
                              {st.name}
                            </span>
                            <span className="text-secondary-custom">${st.price}</span>
                          </div>
                        ))}
                      </div>

                      {veh && (
                        <>
                          <hr className="book-divider my-1 opacity-25" />
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted-custom">Vehicle</span>
                            <span className="text-secondary-custom fw-medium">{veh.make} {veh.model}</span>
                          </div>
                        </>
                      )}
                      
                      <hr className="book-divider my-1" />
                      <div className="d-flex justify-content-between fw-bold fs-5">
                        <span className="text-primary-custom">Total</span>
                        <span className="accent-gradient-text">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-4">
                  <p className="small mb-0 text-muted-custom">Select one or more services to see your summary and estimated total.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default BookService;