import React from 'react';
import '../../Styles/CustomerPages.css';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { mockServices, mockVehicles } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  TrendingUp, CalendarClock, ArrowRight
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

// Status badge for this page
const StatusBadge = ({ status }) => {
  const styles = {
    'completed': 'status-badge-completed',
    'pending': 'status-badge-pending',
    'in-progress': 'status-badge-in-progress',
    'cancelled': 'status-badge-cancelled',
  };
  const s = styles[status] || 'status-badge-default';

  return (
    <span className={`badge rounded-pill fw-medium text-capitalize px-2 py-1 ${s}`}>
      {status.replace('-', ' ')}
    </span>
  );
};

const CustomerDashboard = () => {
  const { user } = useAuth();
  const safeServices = mockServices || [];
  const safeVehicles = mockVehicles || [];

  const activeServices = safeServices.filter(s => !['completed', 'cancelled'].includes(s?.status));
  const completedServices = safeServices.filter(s => s?.status === 'completed');

  const stats = [
    { title: "Active Services", value: activeServices.length, icon: <TrendingUp size={24} />, color: 'var(--accent-primary)', bg: 'var(--accent-glow)', borderColor: 'var(--accent-primary)' },
    { title: "Vehicles", value: safeVehicles.length, icon: <Car size={24} />, color: 'var(--color-success)', bg: 'var(--color-success-bg)', borderColor: 'var(--color-success)' },
    { title: "Completed", value: completedServices.length, icon: <Clock size={24} />, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', borderColor: 'var(--color-warning)' },
    { title: "Upcoming", value: 1, icon: <CalendarClock size={24} />, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', borderColor: 'var(--color-danger)' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 section-header-border">
        <div>
          <h2 className="fw-bold mb-1 text-primary-custom">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="mb-0 text-secondary-custom">Here's an overview of your vehicle services.</p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/customer/book-service" className="btn btn-primary fw-medium d-flex align-items-center gap-2">
            <CalendarPlus size={18} />
            Book Service
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-4 g-lg-5 mb-5">
        {stats.map((stat, index) => (
          <div className="col-sm-6 col-lg-3" key={index}>
            <div className="card border-0 h-100 mb-0" style={{ borderLeft: `3px solid ${stat.borderColor}` }}>
              <div className="card-body d-flex justify-content-between align-items-center p-4 p-xl-5">
                <div>
                  <p className="small text-uppercase fw-bold mb-1 stat-title-small text-muted-custom">{stat.title}</p>
                  <h3 className="mb-0 fw-bold text-primary-custom">{stat.value}</h3>
                </div>
                <div className="stat-icon-wrapper" style={{
                  background: stat.bg,
                  color: stat.color,
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="row g-4 g-lg-5">
        
        {/* Recent Service Table */}
        <div className="col-lg-8">
          <div className="card border-0 h-100">
            <div className="card-header py-4 px-4">
              <h5 className="mb-0 fw-bold text-primary-custom">Recent Service Activity</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4 py-3 small text-uppercase table-header-small text-muted-custom">Service</th>
                      <th className="py-3 small text-uppercase table-header-small text-muted-custom">Vehicle</th>
                      <th className="py-3 small text-uppercase table-header-small text-muted-custom">Status</th>
                      <th className="pe-4 py-3 small text-uppercase table-header-small text-muted-custom">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeServices.length > 0 ? (
                      safeServices.slice(0, 5).map(s => {
                        const v = safeVehicles.find(v => v.id === s.vehicleId);
                        return (
                          <tr key={s.id}>
                            <td className="ps-4 fw-medium text-primary-custom">{s.serviceType}</td>
                            <td className="text-secondary-custom">{v ? `${v.make} ${v.model}` : '—'}</td>
                            <td><StatusBadge status={s.status} /></td>
                            <td className="pe-4 small text-muted-custom">{s.createdAt}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted-custom">No recent services found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header py-4 px-4">
              <h5 className="mb-0 fw-bold text-primary-custom">Quick Actions</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-grid gap-4">
                {[
                  { to: '/customer/book-service', icon: <CalendarPlus size={18} />, label: 'Book New Service' },
                  { to: '/customer/vehicles', icon: <Car size={18} />, label: 'Manage Vehicles' },
                  { to: '/customer/service-tracking', icon: <Activity size={18} />, label: 'Track Services' },
                  { to: '/customer/history', icon: <Clock size={18} />, label: 'View History' },
                ].map((action, i) => (
                  <Link key={i} to={action.to} className="btn text-start p-4 d-flex align-items-center gap-3 quick-action-link">
                    <span style={{ color: 'var(--accent-primary)' }}>{action.icon}</span>
                    <span className="fw-medium">{action.label}</span>
                    <ArrowRight size={14} className="ms-auto" style={{ opacity: 0.5 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;