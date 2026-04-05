import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import { mockVehicles } from '../../data/mockData';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  Plus, X 
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/customer/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/customer/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/customer/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/customer/history', icon: <Clock size={18} /> },
];

export default function Vehicles() {
  const [vehicles] = useState(mockVehicles);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="My Vehicles"
        description="Manage your registered vehicles."
        breadcrumbs={[{ label: 'Dashboard', href: '/customer/dashboard' }, { label: 'Vehicles' }]}
        action={
          <button 
            className="btn btn-primary fw-medium d-flex align-items-center gap-2"
            onClick={() => setDialogOpen(true)}
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        }
      />

      {}
      <div className="row g-4">
        {vehicles.map((v) => (
          <div className="col-sm-6 col-lg-4" key={v.id}>
            <div className="card h-100 border-0">
              <img 
                src={v.image} 
                alt={`${v.make} ${v.model}`} 
                className="card-img-top object-fit-cover vehicle-img-container" 
              />
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3 text-primary-custom">
                  {v.year} {v.make} {v.model}
                </h5>
                <div className="d-flex flex-column gap-2 small">
                  <div className="d-flex justify-content-between pb-2 section-header-border">
                    <span className="text-muted-custom">Plate</span>
                    <span className="fw-medium text-primary-custom">{v.plate}</span>
                  </div>
                  <div className="d-flex justify-content-between pb-2 section-header-border">
                    <span className="text-muted-custom">Color</span>
                    <span className="fw-medium text-primary-custom">{v.color}</span>
                  </div>
                  <div className="d-flex justify-content-between pt-1">
                    <span className="text-muted-custom">Mileage</span>
                    <span className="fw-medium text-primary-custom">{v.mileage.toLocaleString()} mi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      {dialogOpen && (
        <>
          <div className="modal-backdrop fade show vehicle-modal-backdrop"></div>
          <div className="modal fade show d-block vehicle-modal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content vehicle-modal-content">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold text-primary-custom">Add New Vehicle</h5>
                  <button 
                    type="button" 
                    className="btn btn-sm d-flex align-items-center justify-content-center modal-close-btn"
                    onClick={() => setDialogOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="modal-body p-4">
                  <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }}>
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">Make</label>
                        <input type="text" className="form-control" placeholder="Changan" required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">Model</label>
                        <input type="text" className="form-control" placeholder="Alsvin" required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">Year</label>
                        <input type="number" className="form-control" placeholder="2023" required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">Color</label>
                        <input type="text" className="form-control" placeholder="White" required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">License Plate</label>
                        <input type="text" className="form-control" placeholder="ABC-1234" required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-medium text-secondary-custom">Mileage</label>
                        <input type="number" className="form-control" placeholder="15000" required />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label small fw-medium text-secondary-custom">VIN</label>
                      <input type="text" className="form-control" placeholder="1HGBH41JXMN109186" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                      Add Vehicle
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

