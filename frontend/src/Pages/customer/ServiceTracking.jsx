import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import api from '../../lib/api';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  CheckCircle2, ChevronDown, ChevronUp, Circle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/history', icon: <Clock size={18} /> },
];

const steps = ['pending', 'in-progress', 'review-pending', 'completed'];
const stepLabels = ['Pending', 'In Progress', 'In Review', 'Finished'];

export default function ServiceTracking() {
  const [services, setServices] = React.useState([]);
  const [expandedLogs, setExpandedLogs] = useState({});

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

  const activeServices = services.filter(s => !['picked-up', 'cancelled'].includes(s.status));

  const toggleLog = (id) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Service Tracking"
        description="Track the progress of your active services."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Service Tracking' }]}
      />

      {activeServices.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 tracking-empty-container">
          <div className="d-flex align-items-center justify-content-center mb-3 empty-state-icon">
            <Activity size={32} className="tracking-activity-icon" />
          </div>
          <h4 className="fw-bold text-primary-custom">No Active Services</h4>
          <p className="text-secondary-custom">All your services have been picked up or you haven't booked one yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {activeServices.map(s => {
            const v = s.vehicleId;
            const m = s.mechanicId;
            
            const currentIdx = steps.indexOf(s.status);
            const progressPercentage = currentIdx === -1 ? 0 : (currentIdx / (steps.length - 1)) * 100;

            return (
              <div key={s._id} className="card border-0">
                <div className="card-body p-4 p-md-5">
                  
                  {}
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start gap-3 mb-4">
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-1">
                        <h4 className="fw-bold mb-0 text-primary-custom">{s.serviceType}</h4>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="small mb-0 text-secondary-custom">
                        {v ? `${v.year} ${v.make} ${v.model} · ${v.plate}` : '—'}
                      </p>
                    </div>
                    <div className="text-sm-end small">
                      {m && (
                        <p className="mb-1 text-secondary-custom">
                          Mechanic: <span className="fw-bold text-primary-custom">{m.name}</span>
                        </p>
                      )}
                      {s.estimatedCompletion && (
                        <p className="mb-0 text-secondary-custom">
                          Est. completion: <span className="fw-bold text-primary-custom">{s.estimatedCompletion}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {}
                  <div className="position-relative mt-5 mb-2 px-2">
                    <div className="position-absolute top-50 start-0 translate-middle-y w-100 px-4" style={{ zIndex: 1 }}>
                      <div className="progress tracking-progress-bg">
                        <div 
                          className="progress-bar tracking-stepper-bar tracking-progress-bar" 
                          role="progressbar" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                      {stepLabels.map((label, i) => {
                        
                        const isCompleted = i < currentIdx || (s.status === 'completed' && i === currentIdx);
                        const isActive = i === currentIdx && s.status !== 'completed';
                        
                        let nodeClass = 'stepper-node-inactive';
                        if (isCompleted) nodeClass = 'stepper-node-completed';
                        else if (isActive) nodeClass = 'stepper-node-active';

                        return (
                          <div key={label} className="d-flex flex-column align-items-center tracking-step-wrapper">
                            <div className={`d-flex align-items-center justify-content-center rounded-circle stepper-node ${nodeClass}`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : (isActive ? <div className="stepper-dot"></div> : i + 1)}
                            </div>
                            <span className={`small mt-2 text-center fw-medium ${isCompleted || isActive ? 'text-primary-custom' : 'text-muted-custom'}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {}
                  {(s.logs?.length > 0 || s.pendingNotes?.length > 0) && (
                    <div className="mt-5 pt-3 border-top border-opacity-10">
                      <button 
                        className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none transition-hover"
                        onClick={() => toggleLog(s._id)}
                      >
                        {expandedLogs[s._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
                        {expandedLogs[s._id] ? 'Hide Service Log' : 'View Service Log & Milestones'}
                      </button>

                      {expandedLogs[s._id] && (
                        <div className="mt-4 p-4 notes-container rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                          <p className="small fw-bold text-uppercase mb-3 stat-title-small text-muted-custom d-flex align-items-center gap-2">
                            <Activity size={14} /> Logged Milestones
                          </p>
                          <div className="d-flex flex-column gap-4">
                            {s.logs && s.logs.length > 0 && s.logs.map((log, i) => (
                              <div key={i} className="d-flex align-items-start gap-3">
                                <div className="mt-1 flex-shrink-0"><Circle size={10} className="text-primary-custom" /></div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center gap-2">
                                    <span className="text-primary-custom fw-bold lh-base">{log.milestone}</span>
                                    <span className="text-muted-custom" style={{ fontSize: '0.7rem' }}>{new Date(log.timestamp).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {s.pendingNotes && s.pendingNotes.length > 0 && (
                              <div className="p-3 rounded border border-warning border-opacity-25 bg-warning bg-opacity-5">
                                <p className="small fw-bold text-warning mb-0 text-uppercase" style={{ fontSize: '0.65rem' }}>Update in progress...</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

