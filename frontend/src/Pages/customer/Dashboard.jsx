import React from 'react';
import '../../Styles/CustomerPages.css';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import { useSelector } from 'react-redux';
import api from '../../lib/api';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  TrendingUp, CalendarClock, ArrowRight
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/history', icon: <Clock size={18} /> },
];


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

export default function CustomerDashboard() {
  const user = useSelector((state) => state.auth.userInfo);
  const [vehicles, setVehicles] = React.useState([]);
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehRes, servRes] = await Promise.all([
          api.get('/customer/vehicles'),
          api.get('/customer/services')
        ]);
        setVehicles(vehRes.data);
        setServices(servRes.data);
      } catch (error) {
        console.error('Failed to load customer dashboard data', error);
      }
    };
    fetchDashboardData();
  }, []);

  const activeServices = services.filter(s => !['picked-up', 'cancelled'].includes(s?.status));
  const completedServices = services.filter(s => ['completed', 'picked-up'].includes(s?.status));

  const stats = [
    { title: "Active Services", value: activeServices.length, icon: <TrendingUp size={24} />, color: 'var(--accent-primary)', bg: 'var(--accent-glow)', borderColor: 'var(--accent-primary)' },
    { title: "Vehicles", value: vehicles.length, icon: <Car size={24} />, color: 'var(--color-success)', bg: 'var(--color-success-bg)', borderColor: 'var(--color-success)' },
    { title: "Completed", value: completedServices.length, icon: <Clock size={24} />, color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', borderColor: 'var(--color-warning)' },
    { title: "Upcoming", value: services.filter(s => s.status === 'pending').length, icon: <CalendarClock size={24} />, color: 'var(--color-danger)', bg: 'var(--color-danger-bg)', borderColor: 'var(--color-danger)' },
  ];

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      
      {}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 section-header-border">
        <div>
          <h2 className="fw-bold mb-1 text-primary-custom">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="mb-0 text-secondary-custom">Here's an overview of your vehicle services.</p>
        </div>
        <div className="mt-3 mt-md-0">
          <Link to="/book-service" className="btn btn-primary fw-medium d-flex align-items-center gap-2">
            <CalendarPlus size={18} />
            Book Service
          </Link>
        </div>
      </div>

      {}
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

      {}
      <div className="row g-4 g-lg-5">
        
        {}
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
                    {services.length > 0 ? (
                      services.slice(0, 5).map(s => {
                        const v = s.vehicleId;
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

        {}
        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header py-4 px-4">
              <h5 className="mb-0 fw-bold text-primary-custom">Quick Actions</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-grid gap-4">
                {[
                  { to: '/book-service', icon: <CalendarPlus size={18} />, label: 'Book New Service' },
                  { to: '/vehicles', icon: <Car size={18} />, label: 'Manage Vehicles' },
                  { to: '/service-tracking', icon: <Activity size={18} />, label: 'Track Services' },
                  { to: '/history', icon: <Clock size={18} />, label: 'View History' },
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

