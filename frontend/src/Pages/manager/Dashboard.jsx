import React, { useState } from 'react';
import '../../Styles/ManagerPages.css';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import StatCard from '../../Components/shared/StatCard';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import api from '../../lib/api';


import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

import { 
  LayoutDashboard, ClipboardList, Users, ArrowLeftRight, TrendingUp,
  Activity, Star, CheckCircle2, Play, X, UserPlus, Car, Trash2, FileText,
  Camera, Briefcase, ArrowRightCircle, AlertCircle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Requests', url: '/requests', icon: <ClipboardList size={18} /> },
  { title: 'Mechanics', url: '/mechanics', icon: <Users size={18} /> },
  { title: 'Assignments', url: '/assignments', icon: <ArrowLeftRight size={18} /> },
  { title: 'Workflow', url: '/workflow', icon: <TrendingUp size={18} /> },
];

const CHART_PURPLE = '#4E4FEB'; 
const CHART_GREEN = '#34d399';
const CHART_GRID = 'rgba(255, 255, 255, 0.05)';
const CHART_TEXT = '#A1A1AA';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="manager-chart-tooltip">
        <p className="small fw-bold mb-0 manager-text-primary">
          {label}: <span className="manager-text-accent">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ManagerDashboard() {
  const { pathname } = useLocation();
  const [uiMessage, setUiMessage] = useState(null);
  
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);
  const [weeklyBookings, setWeeklyBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [servicesByTypeData, setServicesByTypeData] = useState([]);

  const [assignments, setAssignments] = useState({});
  const [assignNotes, setAssignNotes] = useState({});
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [newMechanic, setNewMechanic] = useState({ name: '', email: '', phone: '', password: '', specialization: '' });
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedServiceNotes, setSelectedServiceNotes] = useState(null);
  const [newPriority, setNewPriority] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [mechRes, reqRes, statsRes] = await Promise.all([
          api.get('/manager/mechanics'),
          api.get('/manager/requests'),
          api.get('/manager/dashboard-stats'),
        ]);
        setMechanics(mechRes.data);
        setServices(reqRes.data.map(s => ({...s, id: s._id})));
        setWeeklyBookings(statsRes.data.weeklyBookings || []);
        setRevenueData(statsRes.data.revenueByMonth || []);
        setServicesByTypeData(statsRes.data.servicesByType || []);
      } catch (error) {
        console.error('Error fetching manager data', error);
      }
    };
    fetchData();
  }, []);

  const pendingRequests = services.filter(s => s.status === 'pending');
  const receivedRequests = services.filter(s => s.status === 'received');
  const inProgressRequests = services.filter(s => s.status === 'in-progress');
  const reviewPendingRequests = services.filter(s => s.status === 'review-pending');
  const completedRequests = services.filter(s => s.status === 'completed');
  const unassignedRequests = [...pendingRequests, ...receivedRequests].filter(s => !s.mechanicId);
  const finishedRequests = services.filter(s => ['completed', 'picked-up'].includes(s.status));
  const completionRate = Math.round((finishedRequests.length / services.length) * 100) || 0;

  const handleAssign = async (serviceId) => {
    const mechanicId = assignments[serviceId];
    if (!mechanicId) {
      setUiMessage({ type: 'error', text: "Please select a mechanic first." });
      return;
    }
    try {
      await api.put(`/manager/requests/${serviceId}/assign`, { 
        mechanicId,
        note: assignNotes[serviceId] || ''
      });
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, mechanicId } : s));
      setAssignNotes(prev => ({ ...prev, [serviceId]: '' }));
      setUiMessage({ type: 'success', text: 'Mechanic assigned successfully!' });
      setTimeout(() => setUiMessage(null), 3000);
    } catch(err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to assign mechanic' });
    }
  };

  const handleAddMechanic = async (e) => {
    e.preventDefault();
    if (!newMechanic.name || !newMechanic.email || !newMechanic.phone || !newMechanic.specialization || !newMechanic.password) return;
    
    try {
      const { data } = await api.post('/manager/mechanics', newMechanic);
      setMechanics([...mechanics, data]);
      setNewMechanic({ name: '', email: '', phone: '', password: '', specialization: '' }); 
      setShowAddMechanic(false);
      setUiMessage({ type: 'success', text: `Account created successfully!` });
      setTimeout(() => setUiMessage(null), 3000);
    } catch(err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create mechanic' });
    }
  };

  const handleDeleteMechanic = async (id) => {
    if (!window.confirm('Delete this mechanic account? This action cannot be undone.')) return;
    try {
      await api.delete(`/manager/mechanics/${id}`);
      setMechanics(prev => prev.filter(m => m._id !== id));
      setServices(prev => prev.map(s => {
        const mechanicId = s.mechanicId?._id || s.mechanicId;
        if (mechanicId !== id) return s;
        return {
          ...s,
          mechanicId: null,
          status: s.status === 'completed' ? s.status : 'pending',
        };
      }));
      setUiMessage({ type: 'success', text: 'Mechanic account deleted successfully.' });
      setTimeout(() => setUiMessage(null), 3000);
    } catch (err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete mechanic' });
    }
  };

  const handleViewNotes = (service) => {
    setSelectedServiceNotes(service);
    setNewPriority(service.priority);
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setSelectedServiceNotes(null);
    setNewPriority('');
  };

  const handlePriorityChange = async () => {
    if (!selectedServiceNotes || !newPriority) return;

    try {
      await api.put(`/manager/requests/${selectedServiceNotes._id}/priority`, { priority: newPriority });
      setServices(prev => prev.map(s => s.id === selectedServiceNotes._id ? { ...s, priority: newPriority } : s));
      setSelectedServiceNotes(prev => ({ ...prev, priority: newPriority }));
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleReview = async (serviceId, decision) => {
    try {
      const { data } = await api.put(`/manager/requests/${serviceId}/review`, { decision });
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: data.status } : s));
      setUiMessage({ type: 'success', text: decision === 'approve' ? 'Job marked as completed!' : 'Job sent back to mechanic.' });
      setTimeout(() => setUiMessage(null), 3000);
    } catch (err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit review' });
    }
  };

  const handlePickup = async (serviceId) => {
    try {
      await api.put(`/manager/requests/${serviceId}/pickup`);
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: 'picked-up' } : s));
      setUiMessage({ type: 'success', text: 'Vehicle marked as Picked Up! Revenue has been recorded.' });
      setTimeout(() => setUiMessage(null), 3000);
    } catch (err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to mark as picked up' });
    }
  };

  const handleReceive = async (serviceId) => {
    try {
      await api.put(`/manager/requests/${serviceId}/receive`);
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: 'received' } : s));
      setUiMessage({ type: 'success', text: 'Vehicle marked as Received!' });
      setTimeout(() => setUiMessage(null), 3000);
    } catch (err) {
      setUiMessage({ type: 'error', text: err.response?.data?.message || 'Failed to mark as received' });
    }
  };

  const purpleServicesByType = servicesByTypeData.map((item, i) => ({
    ...item,
    fill: ['#4E4FEB', '#34d399', '#fbbf24', '#6A6BFF', '#f87171', '#A1A1AA'][i] || '#4E4FEB',
  }));

  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Requests" value={services.length} icon={<ClipboardList size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Active Mechanics" value={mechanics.length} icon={<Users size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending Arrival" value={pendingRequests.length} icon={<Activity size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Workshop" value={receivedRequests.length + inProgressRequests.length} icon={<Play size={24} />} color="warning" /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Weekly Bookings</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="bookings" fill={CHART_PURPLE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Services by Type</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={purpleServicesByType} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={window.innerWidth <= 768 ? 9 : 10} stroke="none">
                    {purpleServicesByType.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Quarterly Revenue</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke={CHART_GREEN} strokeWidth={3} dot={{ fill: CHART_GREEN, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Recent Requests</div>
            
            {}
            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4 py-3 small text-uppercase manager-table-header">Service</th>
                    <th className="py-3 small text-uppercase manager-table-header">Vehicle</th>
                    <th className="py-3 small text-uppercase manager-table-header">Priority</th>
                    <th className="py-3 small text-uppercase manager-table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.slice(0, 5).map(s => {
                    const v = s.vehicleId;
                    return (
                      <tr key={s.id}>
                        <td className="ps-4 fw-medium manager-text-primary border-bottom border-opacity-10">{s.serviceType}</td>
                        <td className="manager-text-secondary border-bottom border-opacity-10">{v ? `${v.make} ${v.model}` : '—'}</td>
                        <td className="border-bottom border-opacity-10"><StatusBadge status={s.priority} /></td>
                        <td className="border-bottom border-opacity-10"><StatusBadge status={s.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {}
            <div className="d-md-none p-3">
              <div className="d-flex flex-column gap-3">
                {services.slice(0, 5).map(s => {
                  const v = s.vehicleId;
                  return (
                    <div key={s.id} className="card bg-secondary border-0 p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold manager-text-primary mb-0">{s.serviceType}</h6>
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted-custom">Vehicle</span>
                        <span className="small manager-text-secondary">{v ? `${v.make} ${v.model}` : '—'}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted-custom">Priority</span>
                        <div className="d-flex flex-column align-items-end">
                          <StatusBadge status={s.priority} />
                          <span className="manager-text-accent fw-bold small mt-1 kanban-cost-text">${s.cost || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Mechanic Workload</div>
            <div className="card-body d-flex flex-column gap-3">
              {mechanics.map(m => (
                <div key={m._id} className="d-flex align-items-center justify-content-between p-3 manager-mechanic-card">
                  <div>
                    <p className="fw-bold mb-0 manager-text-primary">{m.name}</p>
                    <p className="small mb-0 manager-text-muted">{m.specialization}</p>
                  </div>
                  <div className="text-end">
                    <p className="small fw-bold mb-0 manager-text-accent">{m.activeJobs} active</p>
                    <p className="small mb-0 d-flex align-items-center justify-content-end gap-1 manager-text-muted">
                      <Star size={12} className="manager-mechanic-rating text-warning" /> {m.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  
  const renderRequests = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Open Requests" value={pendingRequests.length + inProgressRequests.length} icon={<ClipboardList size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending" value={pendingRequests.length} icon={<Activity size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Urgent" value={services.filter(s => s.priority === 'urgent' && s.status !== 'completed').length} icon={<ArrowLeftRight size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed" value={completedRequests.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="card border-0 bg-card">
        <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">All Service Requests</div>
        
        {}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase manager-table-header">Request</th>
                <th className="py-3 small text-uppercase manager-table-header">Vehicle</th>
                <th className="py-3 small text-uppercase manager-table-header">Priority</th>
                <th className="py-3 small text-uppercase manager-table-header">Status</th>
                <th className="pe-4 py-3 small text-uppercase manager-table-header">Created</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => {
                const vehicle = s.vehicleId;
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium manager-text-primary border-bottom border-opacity-10">{s.serviceType}</td>
                    <td className="manager-text-secondary border-bottom border-opacity-10">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</td>
                    <td className="border-bottom border-opacity-10"><StatusBadge status={s.priority} /></td>
                    <td className="border-bottom border-opacity-10"><StatusBadge status={s.status} /></td>
                    <td className="pe-4 small manager-text-muted border-bottom border-opacity-10">{s.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {}
        <div className="d-md-none p-3">
          <div className="d-flex flex-column gap-3">
            {services.map(s => {
              const vehicle = s.vehicleId;
              return (
                <div key={s.id} className="card bg-secondary border-0 p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold manager-text-primary mb-0">{s.serviceType}</h6>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted-custom">Vehicle</span>
                    <span className="small manager-text-secondary">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small text-muted-custom">Priority</span>
                    <StatusBadge status={s.priority} />
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-opacity-10">
                    <span className="small text-muted-custom">Created</span>
                    <span className="small manager-text-muted">{s.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  
  const renderMechanics = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Mechanics" value={mechanics.length} icon={<Users size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Available" value={mechanics.filter(m => m.activeJobs < 3).length} icon={<CheckCircle2 size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Busy" value={mechanics.filter(m => m.activeJobs >= 3).length} icon={<Activity size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Avg Rating" value={Number((mechanics.reduce((sum, m) => sum + m.rating, 0) / mechanics.length).toFixed(1)) || 0} icon={<Star size={24} />} color="info" /></div>
      </div>
      
      {}
      <div className="card border-0 bg-card mb-4">
        <div className="card-header border-bottom border-opacity-10 d-flex justify-content-between align-items-center">
          <span className="fw-bold manager-text-primary">Team Roster</span>
          <button 
            className="btn btn-sm btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowAddMechanic(!showAddMechanic)}
          >
            {showAddMechanic ? <X size={16} /> : <UserPlus size={16} />}
            {showAddMechanic ? 'Cancel' : 'Hire Mechanic'}
          </button>
        </div>
        
        {showAddMechanic && (
          <div className="card-body border-bottom border-opacity-10 pb-4 bg-elevated">
            <form onSubmit={handleAddMechanic} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2 ls-half kanban-cost-text">Full Name</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  placeholder="e.g. John Doe" 
                  value={newMechanic.name}
                  onChange={e => setNewMechanic({...newMechanic, name: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2 ls-half kanban-cost-text">Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-2" 
                  placeholder="e.g. tech@autocare.com" 
                  value={newMechanic.email}
                  onChange={e => setNewMechanic({...newMechanic, email: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2 ls-half kanban-cost-text">Phone</label>
                <input 
                  type="tel" 
                  className="form-control py-2" 
                  placeholder="+1 555 123 4567" 
                  value={newMechanic.phone}
                  onChange={e => setNewMechanic({...newMechanic, phone: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2 ls-half kanban-cost-text">Password</label>
                <input 
                  type="password" 
                  className="form-control py-2" 
                  placeholder="••••••••" 
                  value={newMechanic.password}
                  onChange={e => setNewMechanic({...newMechanic, password: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2 ls-half kanban-cost-text">Role / Specialty</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  placeholder="e.g. Master Engine Tech" 
                  value={newMechanic.specialization}
                  onChange={e => setNewMechanic({...newMechanic, specialization: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-2">
                {}
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Create Account</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-body d-flex flex-column gap-3">
          {mechanics.map(m => (
            <div key={m._id} className="d-flex align-items-center justify-content-between p-4 manager-mechanic-card transition-hover">
              <div>
                <p className="fw-bold fs-5 mb-0 manager-text-primary">{m.name}</p>
                <p className="mb-0 manager-text-secondary">{m.specialization}</p>
                {m.email && <p className="small mb-0 text-muted mt-1">{m.email}</p>}
                {m.phone && <p className="small mb-0 text-muted">{m.phone}</p>}
              </div>
              <div className="text-end d-flex flex-column align-items-end gap-2">
                <div>
                  <p className="fw-bold mb-0 manager-text-accent">{m.activeJobs} active jobs</p>
                  <p className="small mb-0 d-flex align-items-center justify-content-end gap-1 manager-text-muted mt-1">
                    {m.completedJobs} completed · <Star size={14} className="text-warning" /> {m.rating}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger manager-btn-rounded"
                  onClick={() => handleDeleteMechanic(m._id)}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  
  const renderAssignments = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Unassigned" value={unassignedRequests.length} icon={<ArrowLeftRight size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Needs Review" value={reviewPendingRequests.length} icon={<CheckCircle2 size={24} />} color="info" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgressRequests.length} icon={<Activity size={24} />} color="accent" /></div>
      </div>
      <div className="card border-0 bg-card">
        <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Assignment Board</div>
        
        {}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase manager-table-header">Service</th>
                <th className="py-3 small text-uppercase manager-table-header">Vehicle</th>
                <th className="py-3 small text-uppercase manager-table-header">Amount</th>
                <th className="py-3 small text-uppercase manager-table-header">Status</th>
                <th className="py-3 small text-uppercase manager-table-header">Current Mechanic</th>
                <th className="py-3 small text-uppercase manager-table-header">Notes</th>
                <th className="pe-4 py-3 small text-uppercase manager-table-header">Assign / Reassign</th>
              </tr>
            </thead>
            <tbody>
                {services.filter(s => s.status !== 'picked-up').map(s => {
                  const assignedMechanic = mechanics.find(m => m._id === (s.mechanicId?._id || s.mechanicId));
                  const vehicle = s.vehicleId;
                  const hasNotes = s.description || (s.notes && s.notes.length > 0) || s.logs?.length > 0;
                  return (
                    <tr key={s.id} className={s.status === 'review-pending' ? 'manager-row-review-pending' : ''}>
                      <td className="ps-4 fw-medium manager-text-primary border-bottom border-opacity-10">
                        {s.serviceType}
                        {s.status === 'review-pending' && <span className="ms-2 badge bg-info text-dark notes-modal-meta">NEEDS REVIEW</span>}
                      </td>
                      <td className="manager-text-secondary border-bottom border-opacity-10">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                      </td>
                      <td className="manager-text-accent fw-bold border-bottom border-opacity-10">
                        ${s.cost || 0}
                      </td>
                      <td className="border-bottom border-opacity-10"><StatusBadge status={s.status} /></td>
                      <td className="manager-text-secondary border-bottom border-opacity-10">
                        {assignedMechanic ? (
                          <>
                            <div>{assignedMechanic.name}</div>
                            {assignedMechanic.phone && <div className="small text-muted-custom">{assignedMechanic.phone}</div>}
                          </>
                        ) : (
                          <span className="text-danger small fw-bold">UNASSIGNED</span>
                        )}
                      </td>
                      <td className="border-bottom border-opacity-10">
                        <div className="d-flex gap-2">
                          {hasNotes && (
                            <button
                              className="btn btn-sm btn-outline-info manager-btn-rounded"
                              onClick={() => handleViewNotes(s)}
                              title="View job history/notes"
                            >
                              <FileText size={14} />
                            </button>
                          )}
                          {s.completionImage && (
                            <button
                              className="btn btn-sm btn-outline-success manager-btn-rounded"
                              onClick={() => window.open(s.completionImage)}
                              title="View completion photo"
                            >
                              <Camera size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="pe-4 border-bottom border-opacity-10">
                        {s.status === 'pending' ? (
                          <button 
                            className="btn btn-sm btn-info w-100 fw-bold manager-btn-rounded d-flex align-items-center justify-content-center gap-2"
                            onClick={() => handleReceive(s.id)}
                          >
                            <ArrowRightCircle size={14} /> Receive Vehicle
                          </button>
                        ) : s.status === 'review-pending' ? (
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success fw-bold manager-btn-rounded px-3" onClick={() => handleReview(s.id, 'approve')}>Approve</button>
                            <button className="btn btn-sm btn-outline-warning fw-bold manager-btn-rounded px-3" onClick={() => handleReview(s.id, 'redo')}>Further Work</button>
                          </div>
                        ) : s.status === 'completed' ? (
                          <button className="btn btn-sm btn-primary w-100 fw-bold manager-btn-rounded" onClick={() => handlePickup(s.id)}>
                            <Briefcase size={14} className="me-1" /> Owner Took Car
                          </button>
                        ) : (
                          <div className="d-flex flex-column gap-2 manager-select-assign">
                            <div className="d-flex gap-2">
                              <select 
                                className="form-select form-select-sm" 
                                value={assignments[s.id] || s.mechanicId?._id || s.mechanicId || ''} 
                                onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                              >
                                <option value="" disabled>Select mechanic...</option>
                                {mechanics.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                              </select>
                              <button className="btn btn-sm btn-outline-primary fw-medium manager-btn-rounded" onClick={() => handleAssign(s.id)}>Save</button>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Instruction for mechanic (optional)..."
                              value={assignNotes[s.id] || ''}
                              onChange={e => setAssignNotes(p => ({ ...p, [s.id]: e.target.value }))}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        
        <div className="d-md-none p-3">
          <div className="d-flex flex-column gap-3">
            {services.filter(s => s.status !== 'completed').map(s => {
              const assignedMechanic = mechanics.find(m => m._id === (s.mechanicId?._id || s.mechanicId));
              const vehicle = s.vehicleId;
              const hasNotes = s.description || (s.notes && s.notes.length > 0);
              return (
                <div key={s.id} className="card bg-secondary border-0 p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold manager-text-primary mb-1">{s.serviceType}</h6>
                      <p className="small mb-0 manager-text-secondary">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                      </p>
                    </div>
                    <div className="text-end">
                      <StatusBadge status={s.status} />
                      <div className="manager-text-accent fw-bold small mt-1">${s.cost || 0}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="small text-muted-custom mb-1 d-block">Assigned To</label>
                    <div className="small manager-text-secondary fw-semibold">
                      {assignedMechanic?.name || <span className="text-danger">UNASSIGNED</span>}
                    </div>
                  </div>

                  {hasNotes && (
                    <div className="mb-3">
                      <button
                        className="btn btn-sm btn-outline-info w-100 manager-btn-rounded"
                        onClick={() => handleViewNotes(s)}
                      >
                        <FileText size={14} className="me-1" />
                        View Client Notes
                      </button>
                    </div>
                  )}

                  <div className="pt-3 border-top border-opacity-10">
                    {s.status === 'pending' ? (
                      <button 
                        className="btn btn-sm btn-info w-100 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleReceive(s.id)}
                      >
                        <ArrowRightCircle size={14} /> Receive Vehicle
                      </button>
                    ) : s.status === 'review-pending' ? (
                      <div className="d-flex flex-column gap-2">
                        <p className="small text-info fw-bold mb-1 text-center">WAITING FOR YOUR REVIEW</p>
                        {s.completionImage && (
                          <button className="btn btn-sm btn-outline-success w-100 mb-2" onClick={() => window.open(s.completionImage)}>
                            <Camera size={14} className="me-2" /> View Completion Photo
                          </button>
                        )}
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success flex-grow-1 fw-bold" onClick={() => handleReview(s.id, 'approve')}>Approve Job</button>
                          <button className="btn btn-sm btn-outline-warning flex-grow-1 fw-bold" onClick={() => handleReview(s.id, 'redo')}>Further Work Required</button>
                        </div>
                      </div>
                    ) : s.status === 'completed' ? (
                      <button className="btn btn-sm btn-primary w-100 fw-bold py-2" onClick={() => handlePickup(s.id)}>
                         <Briefcase size={14} className="me-2" /> Owner Took Car
                      </button>
                    ) : (
                      <>
                        <label className="small text-muted-custom mb-2 d-block">{s.mechanicId ? 'Reassign Mechanic' : 'Assign Mechanic'}</label>
                        <div className="d-flex gap-2 mb-2">
                          <select 
                            className="form-select form-select-sm" 
                            value={assignments[s.id] || s.mechanicId?._id || s.mechanicId || ''} 
                            onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                          >
                            <option value="" disabled>Select mechanic...</option>
                            {mechanics.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                          </select>
                          <button className="btn btn-sm btn-primary px-3" onClick={() => handleAssign(s.id)}>Save</button>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Instruction for mechanic (optional)..."
                          value={assignNotes[s.id] || ''}
                          onChange={e => setAssignNotes(p => ({ ...p, [s.id]: e.target.value }))}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const renderWorkflow = () => (
    <>
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3"><StatCard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending Arrival" value={pendingRequests.length} icon={<ClipboardList size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Workshop" value={receivedRequests.length + inProgressRequests.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Ready for Pickup" value={completedRequests.length} icon={<CheckCircle2 size={24} />} color="accent" /></div>
      </div>
      
      <div className="d-flex flex-column gap-5">
        {[
          { title: 'Pending Arrival', status: 'pending', color: 'var(--color-danger)' },
          { title: 'Vehicle Received', status: 'received', color: 'var(--accent-primary)' },
          { title: 'Work In Progress', status: 'in-progress', color: 'var(--color-warning)' },
          { title: 'Ready for Pickup', status: 'completed', color: 'var(--color-success)' },
          { title: 'Handed to Customer', status: 'picked-up', color: 'var(--color-info, #38bdf8)' },
        ].map(column => {
          const columnServices = services.filter(s => s.status === column.status);
          
          return (
            <div key={column.status} className="manager-workflow-section">
              <div className="d-flex align-items-center justify-content-between mb-3 px-1">
                <h5 className="fw-bold manager-text-primary mb-0 d-flex align-items-center gap-2">
                  <div className="kanban-col-dot bg-accent-glow-custom"></div>
                  {column.title}
                  <span className="badge rounded-pill bg-secondary bg-opacity-25 ms-2 small notes-modal-accent">
                    {columnServices.length}
                  </span>
                </h5>
                {columnServices.length > 5 && (
                  <span className="small text-muted-custom">Scroll to see more →</span>
                )}
              </div>

              <div className="manager-workflow-horizontal-scroll d-flex gap-3 pb-2">
                {columnServices.length > 0 ? (
                  columnServices.map(s => {
                    const v = s.vehicleId;
                    const m = mechanics.find(m => m._id === (s.mechanicId?._id || s.mechanicId));
                    
                    return (
                      <div key={s.id} className="manager-kanban-item-card transition-hover flex-shrink-0 min-w-300">
                        <div className="p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <p className="fw-bold mb-0 manager-text-primary text-truncate pe-2 manager-select-assign" title={s.serviceType}>
                              {s.serviceType}
                            </p>
                            <StatusBadge status={s.priority} />
                          </div>
                          
                          <div className="d-flex align-items-center gap-2 mb-2 text-secondary-custom small">
                            <Car size={14} />
                            <span className="text-truncate">{v ? `${v.make} ${v.model}` : 'Unknown'}</span>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-opacity-10">
                            <div className="d-flex align-items-center gap-2">
                              <div className="user-profile-avatar avatar-xs">
                                {m ? m.name.charAt(0) : '?'}
                              </div>
                              <span className={`small ${m ? 'manager-text-secondary' : 'text-danger'} kanban-cost-text`}>
                                {m ? m.name.split(' ')[0] : 'Unassigned'}
                              </span>
                            </div>
                            <span className="manager-text-accent fw-bold small">${s.cost || 0}</span>
                          </div>

                          {column.status === 'completed' && (
                            <button
                              className="btn btn-sm btn-primary w-100 mt-3 fw-bold py-1 notes-modal-accent"
                              onClick={() => handlePickup(s.id)}
                            >
                              Hand Over
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 w-100 rounded border border-dashed border-opacity-10 bg-elevated-transparent">
                    <p className="small mb-0 manager-text-muted">No jobs in this stage.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const routeMap = {
    '/dashboard': { title: 'Manager Dashboard', description: 'Monitor operations, analyze revenue, and track team performance.', render: renderDashboard },
    '/requests': { title: 'Service Requests', description: 'Review incoming requests and monitor queue health.', render: renderRequests },
    '/mechanics': { title: 'Mechanics Team', description: 'Manage your roster, hire mechanics, and track individual performance.', render: renderMechanics },
    '/assignments': { title: 'Assignments', description: 'Assign and rebalance workloads across your mechanics.', render: renderAssignments },
    '/workflow': { title: 'Workflow Command Center', description: 'Monitor all active bays and track jobs through the 3-stage repair pipeline.', render: renderWorkflow },
  };

  const page = routeMap[pathname] || routeMap['/dashboard'];

  return (
    <>
      <DashboardLayout menuItems={menuItems} sectionLabel="Manager">
        <PageHeader
          title={page.title}
          description={page.description}
          breadcrumbs={[{ label: 'Dashboard' }]}
        />
        {uiMessage && (
          <div className={`alert ${uiMessage.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mb-4 border-0 shadow-sm mx-3 inline-alert`}>
            {uiMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {uiMessage.text}
          </div>
        )}
        {page.render()}
      </DashboardLayout>

      {/* Notes Modal */}
      {showNotesModal && selectedServiceNotes && (
        <>
          <div
            className="modal-backdrop show manager-modal-backdrop"
            onClick={handleCloseNotesModal}
          />
          <div
            className="modal show d-block manager-modal-dialog"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg">
              <div
                className="manager-modal-content-custom"
              >
                <div
                  className="modal-header border-bottom border-opacity-10 bg-elevated"
                >
                  <h5 className="modal-title fw-bold manager-text-primary d-flex align-items-center gap-2">
                    <FileText size={20} className="text-info" />
                    Service Notes - {selectedServiceNotes.serviceType}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white opacity-75 icon-invert"
                    onClick={handleCloseNotesModal}
                  />
                </div>
                <div className="modal-body p-4">
                  {/* Customer & Vehicle Info */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="small text-muted-custom fw-semibold text-uppercase mb-2 ls-half">
                        Customer Details
                      </div>
                      <div className="p-3 rounded bg-secondary-box">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="user-profile-avatar avatar-md bg-accent-primary-custom">
                            {selectedServiceNotes.customerId?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <h6 className="mb-0 manager-text-primary fw-bold">{selectedServiceNotes.customerId?.name || 'Unknown Customer'}</h6>
                            <p className="small mb-0 text-muted">{selectedServiceNotes.customerId?.email || 'No email provided'}</p>
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 pt-2">
                          {selectedServiceNotes.customerId?.phone && (
                            <div className="small text-muted-custom"><span className="fw-medium manager-text-primary">Phone:</span> {selectedServiceNotes.customerId.phone}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted-custom fw-semibold text-uppercase mb-2 ls-half">
                        Assigned Mechanic
                      </div>
                      <div className="p-3 rounded bg-secondary-box">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="user-profile-avatar avatar-md bg-accent-glow-custom">
                            {selectedServiceNotes.mechanicId?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <h6 className="mb-0 manager-text-primary fw-bold">{selectedServiceNotes.mechanicId?.name || 'Unassigned'}</h6>
                            {selectedServiceNotes.mechanicId?.phone ? (
                              <p className="small mb-0 text-muted">{selectedServiceNotes.mechanicId.phone}</p>
                            ) : (
                              <p className="small mb-0 text-muted">No mechanic assigned yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted-custom fw-semibold text-uppercase mb-2 ls-half">
                        Vehicle Details
                      </div>
                      <div className="p-3 rounded bg-secondary-box">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="d-flex align-items-center justify-content-center avatar-md bg-accent-glow-custom border-radius-custom">
                            <Car size={20} className="text-primary" />
                          </div>
                          <div>
                            <h6 className="mb-0 manager-text-primary fw-bold">
                              {selectedServiceNotes.vehicleId ? `${selectedServiceNotes.vehicleId.make} ${selectedServiceNotes.vehicleId.model}` : 'Unknown Vehicle'}
                            </h6>
                            {selectedServiceNotes.vehicleId?.year && (
                              <p className="small mb-0 text-muted">Year: {selectedServiceNotes.vehicleId.year}</p>
                            )}
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-2 pt-2">
                          {selectedServiceNotes.vehicleId?.plate && (
                            <div className="small text-muted-custom"><span className="fw-medium manager-text-primary">License Plate:</span> {selectedServiceNotes.vehicleId.plate}</div>
                          )}
                          {selectedServiceNotes.vehicleId?.color && (
                            <div className="small text-muted-custom"><span className="fw-medium manager-text-primary">Color:</span> {selectedServiceNotes.vehicleId.color}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted mb-3 d-block ls-half">
                      Service Description
                    </label>
                    <div className="p-4 rounded bg-secondary-box">
                      <p className="mb-0 manager-text-primary lh-base">
                        {selectedServiceNotes.description || 'No description provided for this service.'}
                      </p>
                    </div>
                  </div>

                  {/* Job History / Logs */}
                  {(selectedServiceNotes.logs?.length > 0 || selectedServiceNotes.pendingNotes?.length > 0 || selectedServiceNotes.notes?.length > 0) && (
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase text-muted mb-3 d-block ls-half">
                        Service History & Progress
                      </label>
                      <div className="p-4 rounded bg-secondary-box">
                        
                        {/* General Notes */}
                        {selectedServiceNotes.notes?.length > 0 && (
                          <div className="mb-3">
                            <p className="small fw-bold text-muted text-uppercase mb-2 notes-modal-section-header">General Notes</p>
                            <ul className="list-unstyled mb-0">
                              {selectedServiceNotes.notes.map((note, index) => (
                                <li key={index} className="mb-2 d-flex flex-column gap-0">
                                  <div className="d-flex align-items-start gap-3">
                                    <span className="text-secondary mt-1 notes-modal-dot-small">●</span>
                                    <span className="manager-text-primary small">{note.text || note}</span>
                                  </div>
                                  {note.authorId && (
                                    <span className="ms-4 text-muted notes-modal-meta">— {note.authorId.name}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Structured Logs */}
                        {selectedServiceNotes.logs?.length > 0 && (
                          <div className="d-flex flex-column gap-3 mb-3">
                            {selectedServiceNotes.logs.map((log, i) => (
                              <div key={i} className="p-3 rounded border border-opacity-10 bg-elevated-transparent">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <span className="fw-bold manager-text-primary small">{log.milestone}</span>
                                  <span className="text-muted small notes-modal-timestamp">{new Date(log.timestamp).toLocaleDateString()}</span>
                                </div>
                                
                                {log.technicianId && (
                                  <p className="small text-accent fw-bold mb-2 notes-modal-accent">
                                    Logged by: {log.technicianId.name} ({log.technicianId.role})
                                  </p>
                                )}

                                {log.notes?.length > 0 && (
                                  <ul className="list-unstyled mb-2 ps-2">
                                    {log.notes.map((n, ni) => (
                                      <li key={ni} className="text-muted small d-flex flex-column gap-0 mb-1">
                                        <div className="d-flex align-items-center gap-2">
                                          <div className="notes-modal-dot-tiny"></div>
                                          <span>{n.text || n}</span>
                                        </div>
                                        {n.authorId && (
                                          <span className="ms-3 text-muted notes-modal-meta">— {n.authorId.name}</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {log.image && (
                                  <div className="mt-2 pt-2 border-top border-opacity-10">
                                    <button 
                                      className="btn btn-sm btn-outline-success d-flex align-items-center gap-2 notes-modal-btn-compact"
                                      onClick={() => window.open(log.image)}
                                    >
                                      <Camera size={12} /> View Completion Photo
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Pending Notes */}
                        {selectedServiceNotes.pendingNotes?.length > 0 && (
                          <div className="p-3 rounded border border-warning border-opacity-25 notes-modal-warning-bg">
                            <p className="small fw-bold text-warning mb-2 text-uppercase notes-modal-section-header">Pending Updates</p>
                            <ul className="list-unstyled mb-0 ps-2">
                              {selectedServiceNotes.pendingNotes.map((n, ni) => (
                                <li key={ni} className="text-muted-custom small d-flex flex-column gap-0 mb-1">
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="notes-modal-warning-dot"></div>
                                    <span>{n.text || n}</span>
                                  </div>
                                  {n.authorId && (
                                    <span className="ms-3 text-muted notes-modal-meta">— {n.authorId.name}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Priority & Status */}
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-muted mb-3 d-block ls-half">
                        Priority Level
                      </label>
                      <div className="d-flex gap-3 align-items-center">
                        <select
                          className="form-select flex-grow-1 form-select-custom"
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent Priority</option>
                        </select>
                        <button
                          type="button"
                          className="btn btn-primary px-4 py-2 fw-bold btn-save-compact"
                          onClick={handlePriorityChange}
                          disabled={newPriority === selectedServiceNotes.priority}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-muted mb-3 d-block ls-half">
                        Current Status
                      </label>
                      <div className="d-flex align-items-center">
                        <StatusBadge status={selectedServiceNotes.status} />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal-footer border-top border-opacity-10 bg-elevated"
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 btn-close-compact"
                    onClick={handleCloseNotesModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

