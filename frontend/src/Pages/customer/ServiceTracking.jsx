import React from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import { mockServices, mockVehicles, mockMechanics } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

const steps = ['received', 'diagnosed', 'in-progress', 'completed'];
const stepLabels = ['Received', 'Diagnosed', 'In Progress', 'Completed'];

const ServiceTracking = () => {
  const activeServices = mockServices.filter(s => !['completed', 'cancelled'].includes(s.status));

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="Service Tracking"
        description="Track the progress of your active services."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'Service Tracking' }]}
      />

      {activeServices.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 tracking-empty-container">
          <div className="d-flex align-items-center justify-content-center mb-3 empty-state-icon">
            <Activity size={32} className="tracking-activity-icon" />
          </div>
          <h4 className="fw-bold text-primary-custom">No Active Services</h4>
          <p className="text-secondary-custom">All your services have been completed.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {activeServices.map(s => {
            const v = mockVehicles.find(v => v.id === s.vehicleId);
            const m = mockMechanics.find(m => m.id === s.mechanicId);
            const currentIdx = steps.indexOf(s.status);
            const progressPercentage = (currentIdx / (steps.length - 1)) * 100;

            return (
              <div key={s.id} className="card border-0">
                <div className="card-body p-4 p-md-5">
                  
                  {/* Top Header Row */}
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

                  {/* Progress Stepper UI */}
                  <div className="position-relative mt-5 mb-2 px-2">
                    {/* The Background Line */}
                    <div className="position-absolute top-50 start-0 translate-middle-y w-100 px-4" style={{ zIndex: 1 }}>
                      <div className="progress tracking-progress-bg">
                        <div 
                          className="progress-bar tracking-stepper-bar tracking-progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${progressPercentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* The Step Nodes */}
                    <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
                      {stepLabels.map((label, i) => (
                        <div key={label} className="d-flex flex-column align-items-center tracking-step-wrapper">
                          <div 
                            className={`d-flex align-items-center justify-content-center rounded-circle stepper-node ${i <= currentIdx ? 'stepper-node-active' : 'stepper-node-inactive'}`}
                          >
                            {i + 1}
                          </div>
                          <span className={`small mt-2 text-center ${i <= currentIdx ? 'stepper-label-active' : 'stepper-label-inactive'}`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes Section */}
                  {s.notes && s.notes.length > 0 && (
                    <div className="mt-5 p-3 notes-container">
                      <p className="small fw-bold text-uppercase mb-2 stat-title-small text-muted-custom">Latest Updates</p>
                      <ul className="mb-0 small ps-3 text-secondary-custom">
                        {s.notes.map((n, i) => (
                          <li key={i} className="mb-1">{n}</li>
                        ))}
                      </ul>
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

export default ServiceTracking;