import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import { mockServices, mockVehicles } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  Search, Star
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

// Interactive Star Rating Component
const RatingStars = ({ currentRating, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => {
        const isActive = star <= (hoverRating || currentRating);
        return (
          <Star
            key={star}
            size={18}
            className="transition-hover"
            style={{ 
              cursor: 'pointer', 
              color: isActive ? 'var(--color-warning)' : 'var(--text-muted)',
              opacity: isActive ? 1 : 0.3
            }}
            fill={isActive ? 'var(--color-warning)' : 'none'}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRate(star)}
          />
        );
      })}
    </div>
  );
};

const ServiceHistory = () => {
  const [search, setSearch] = useState('');
  
  // Bring services into local state so we can dynamically update the ratings
  const [services, setServices] = useState(mockServices);
  
  const completed = services.filter(s => s.status === 'completed');
  const filtered = completed.filter(s =>
    s.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  const handleRateService = (serviceId, ratingValue) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, customerRating: ratingValue } : s
    ));
    // In a real app, this would fire an API call to save the rating to the backend
  };

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Service History"
        description="View all your past service records and leave feedback."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'History' }]}
      />

      {/* Main Unified Card Container */}
      <div className="card border-0 bg-card overflow-hidden">
        
        {/* Card Header with Integrated Search Bar */}
        <div className="card-header border-bottom border-opacity-10 py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 bg-transparent">
          <h6 className="fw-bold mb-0 text-primary-custom text-uppercase" style={{ letterSpacing: '0.5px' }}>
            Past Services
          </h6>
          
          <div className="input-group" style={{ maxWidth: '350px' }}>
            <span className="input-group-text search-input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control search-input-box"
              placeholder="Search services (e.g. Oil Change)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Service History Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10">Service</th>
                <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10">Vehicle</th>
                <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10">Date</th>
                <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10">Cost</th>
                <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10">Rate Service</th>
                <th className="pe-4 py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom border-bottom border-opacity-10 text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted-custom">
                    No records found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const v = mockVehicles.find(v => v.id === s.vehicleId);
                  return (
                    <tr key={s.id}>
                      <td className="ps-4 fw-medium text-primary-custom border-bottom border-opacity-10">{s.serviceType}</td>
                      <td className="text-secondary-custom border-bottom border-opacity-10">{v ? `${v.make} ${v.model}` : '—'}</td>
                      <td className="text-secondary-custom border-bottom border-opacity-10">{s.createdAt}</td>
                      <td className="fw-medium border-bottom border-opacity-10" style={{ color: 'var(--accent-primary)' }}>${s.cost}</td>
                      <td className="border-bottom border-opacity-10">
                        <RatingStars 
                          currentRating={s.customerRating || 0} 
                          onRate={(val) => handleRateService(s.id, val)} 
                        />
                      </td>
                      <td className="pe-4 border-bottom border-opacity-10 text-end"><StatusBadge status={s.status} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ServiceHistory;