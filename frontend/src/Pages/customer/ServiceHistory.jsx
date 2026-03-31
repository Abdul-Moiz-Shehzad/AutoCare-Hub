import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import { mockServices, mockVehicles } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  Search
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

const ServiceHistory = () => {
  const [search, setSearch] = useState('');
  
  const completed = mockServices.filter(s => s.status === 'completed');
  const filtered = completed.filter(s =>
    s.serviceType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Service History"
        description="View all your past service records."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'History' }]}
      />

      <div className="card border-0">
        <div className="card-body p-4">
          
          {/* Search Input */}
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="input-group">
                <span className="input-group-text search-input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control search-input-box"
                  placeholder="Search services..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Service History Table */}
          <div className="table-responsive table-container">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4 py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom">Service</th>
                  <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom">Vehicle</th>
                  <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom">Date</th>
                  <th className="py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom">Cost</th>
                  <th className="pe-4 py-3 small text-uppercase table-header-small table-header-secondary text-muted-custom">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted-custom">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(s => {
                    const v = mockVehicles.find(v => v.id === s.vehicleId);
                    return (
                      <tr key={s.id}>
                        <td className="ps-4 fw-medium text-primary-custom">{s.serviceType}</td>
                        <td className="text-secondary-custom">{v ? `${v.make} ${v.model}` : '—'}</td>
                        <td className="text-secondary-custom">{s.createdAt}</td>
                        <td className="fw-medium" style={{ color: 'var(--accent-primary)' }}>${s.cost}</td>
                        <td className="pe-4"><StatusBadge status={s.status} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceHistory;