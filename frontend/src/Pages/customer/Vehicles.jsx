import React, { useState } from 'react';
import '../../Styles/CustomerPages.css';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import PageHeader from '../../Components/shared/PageHeader';
import api from '../../lib/api';
import { 
  LayoutDashboard, Car, CalendarPlus, Activity, Clock, 
  Plus, X, Trash2, Edit2
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Vehicles', url: '/vehicles', icon: <Car size={18} /> },
  { title: 'Book Service', url: '/book-service', icon: <CalendarPlus size={18} /> },
  { title: 'Service Tracking', url: '/service-tracking', icon: <Activity size={18} /> },
  { title: 'History', url: '/history', icon: <Clock size={18} /> },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uiMessage, setUiMessage] = useState(null);
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', color: '', plate: '', mileage: '', vin: '', image: ''
  });
  const showMsg = (type, text) => {
    setUiMessage({ type, text });
    setTimeout(() => setUiMessage(null), 4000);
  };

  const SLEEK_CAR_PLACEHOLDER = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

  React.useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/customer/vehicles');
        setVehicles(data);
      } catch(err) {
        console.error('Failed to load vehicles');
      }
    };
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      if (uploadFile) {
        const fileData = new FormData();
        fileData.append('image', uploadFile);
        const { data } = await api.post('/upload', fileData, { headers: { 'Content-Type': 'multipart/form-data' }});
        const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
        imageUrl = baseUrl + data.imagePath;
      } else if (!imageUrl && !editingId) {
        imageUrl = SLEEK_CAR_PLACEHOLDER;
      }

      if (editingId) {
        const { data } = await api.put(`/customer/vehicles/${editingId}`, { ...formData, image: imageUrl });
        setVehicles(vehicles.map(v => v._id === editingId ? data : v));
        showMsg('success', 'Vehicle updated successfully!');
      } else {
        const { data } = await api.post('/customer/vehicles', { ...formData, image: imageUrl });
        setVehicles([...vehicles, data]);
        showMsg('success', 'Vehicle added successfully!');
      }

      setDialogOpen(false);
      setEditingId(null);
      setFormData({ make: '', model: '', year: '', color: '', plate: '', mileage: '', vin: '', image: '' });
      setUploadFile(null);
    } catch(err) {
      console.error('Save vehicle error details:', err.response?.data || err);
      showMsg('error', err.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleEditClick = (v) => {
    setEditingId(v._id);
    setFormData({
      make: v.make, model: v.model, year: v.year, color: v.color, 
      plate: v.plate, mileage: v.mileage, vin: v.vin || '', image: v.image || ''
    });
    setUploadFile(null);
    setDialogOpen(true);
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/customer/vehicles/${id}`);
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (error) {
      showMsg('error', error.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Customer">
      <PageHeader
        title="My Vehicles"
        description="Manage your registered vehicles."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Vehicles' }]}
        action={
          <button 
            className="btn btn-primary fw-medium d-flex align-items-center gap-2"
            onClick={() => {
              setEditingId(null);
              setFormData({ make: '', model: '', year: '', color: '', plate: '', mileage: '', vin: '', image: '' });
              setUploadFile(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        }
      />

      {uiMessage && (
        <div className={`alert ${uiMessage.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mb-4 border-0 shadow-sm inline-alert`}>
          {uiMessage.text}
        </div>
      )}
      <div className="row g-4">
        {vehicles.map((v) => (
          <div className="col-sm-6 col-lg-4" key={v._id}>
            <div className="card h-100 border-0">
              <img 
                src={v.image || SLEEK_CAR_PLACEHOLDER} 
                alt={`${v.make} ${v.model}`} 
                className="card-img-top object-fit-cover vehicle-img-container" 
              />
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3 text-primary-custom d-flex justify-content-between align-items-center">
                  <span>{v.year} {v.make} {v.model}</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm text-secondary-custom p-0 transition-hover" onClick={() => handleEditClick(v)} aria-label="Edit Vehicle">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-sm text-danger p-0 transition-hover" onClick={() => handleDeleteVehicle(v._id)} aria-label="Delete Vehicle">
                      <Trash2 size={16} />
                    </button>
                  </div>
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
                    <span className="fw-medium text-primary-custom">{v.mileage.toLocaleString()} KM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dialogOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setDialogOpen(false); setEditingId(null); }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content vehicle-modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-primary-custom">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h5>
                <button 
                  type="button" 
                  className="btn btn-sm d-flex align-items-center justify-content-center modal-close-btn"
                  onClick={() => { setDialogOpen(false); setEditingId(null); }}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="modal-body p-4">
                <form onSubmit={handleAddVehicle}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Make</label>
                      <input type="text" className="form-control" placeholder="Changan" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Model</label>
                      <input type="text" className="form-control" placeholder="Alsvin" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Year</label>
                      <input type="number" className="form-control" placeholder="2023" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Color</label>
                      <input type="text" className="form-control" placeholder="White" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">License Plate</label>
                      <input type="text" className="form-control" placeholder="ABC-1234" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Mileage</label>
                      <input type="number" className="form-control" placeholder="15000" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} required />
                    </div>
                  </div>
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">VIN</label>
                      <input type="text" className="form-control" placeholder="1HGBH41JXMN109186" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-medium text-secondary-custom">Vehicle Photo (Optional)</label>
                      <input type="file" className="form-control" onChange={e => setUploadFile(e.target.files[0])} accept="image/*" />
                      <div className="form-text small notes-modal-accent">Leave blank to use default image</div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                    {editingId ? 'Save Changes' : 'Add Vehicle'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

