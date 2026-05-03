import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import api from '../../lib/api';
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

export default function ServiceHistory() {
  const [search, setSearch] = useState('');
  
  const [services, setServices] = useState([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/customer/services');
        setServices(data);
      } catch(err) {
        console.error('Failed to load services');
      }
    };
    fetchServices();
  }, []);
  
  const completed = services.filter(s => ['completed', 'picked-up'].includes(s.status));
  const filtered = completed.filter(s =>
    s.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  const handleRateService = async (serviceId, ratingValue) => {
    try {
      await api.put(`/customer/services/${serviceId}/rate`, { rating: ratingValue });
      setServices(prev => prev.map(s => 
        s._id === serviceId ? { ...s, customerRating: ratingValue } : s
      ));
    } catch(err) {
      alert(err.response?.data?.message || 'Failed to rate service');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Service History"
        description="View all your past service records and leave feedback."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'History' }]}
      />

      {}
      <div className="card border-0 bg-card overflow-hidden">
        
        {}
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

        {}
        <div className="table-responsive d-none d-md-block">
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
                  const v = s.vehicleId;
                  return (
                    <tr key={s._id}>
                      <td className="ps-4 fw-medium text-primary-custom border-bottom border-opacity-10">{s.serviceType}</td>
                      <td className="text-secondary-custom border-bottom border-opacity-10">{v ? `${v.make} ${v.model}` : '—'}</td>
                      <td className="text-secondary-custom border-bottom border-opacity-10">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="fw-medium border-bottom border-opacity-10" style={{ color: 'var(--accent-primary)' }}>${s.cost || 'N/A'}</td>
                      <td className="border-bottom border-opacity-10">
                        <RatingStars 
                          currentRating={s.customerRating || 0} 
                          onRate={(val) => handleRateService(s._id, val)} 
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

        {}
        <div className="d-md-none p-3">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted-custom">
              No records found matching your search.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filtered.map(s => {
                const v = s.vehicleId;
                return (
                  <div key={s._id} className="card bg-secondary border-0 p-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold text-primary-custom mb-1">{s.serviceType}</h6>
                        <span className="small text-secondary-custom">{v ? `${v.make} ${v.model}` : '—'}</span>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-opacity-10 mb-2">
                      <span className="small text-muted-custom">Date</span>
                      <span className="small text-secondary-custom">{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="small text-muted-custom">Cost</span>
                      <span className="fw-bold" style={{ color: 'var(--accent-primary)' }}>${s.cost || 'N/A'}</span>
                    </div>

                    <div className="pt-2 border-top border-opacity-10 text-center">
                      <p className="small text-muted-custom mb-2">How was your service?</p>
                      <div className="d-flex justify-content-center">
                        <RatingStars 
                          currentRating={s.customerRating || 0} 
                          onRate={(val) => handleRateService(s._id, val)} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

