import React, { useState } from 'react';
import '../../Styles/ManagerPages.css';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import StatCard from '../../Components/shared/StatCard';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import { 
  mockServices, mockVehicles, mockMechanics, 
  weeklyBookingsData, servicesByTypeData, revenueData 
} from '../../data/mockData';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

import { 
  LayoutDashboard, ClipboardList, Users, ArrowLeftRight, TrendingUp,
  Activity, Star, CheckCircle2, Play, Plus, X, UserPlus, Car
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/manager/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Requests', url: '/manager/requests', icon: <ClipboardList size={18} /> },
  { title: 'Mechanics', url: '/manager/mechanics', icon: <Users size={18} /> },
  { title: 'Assignments', url: '/manager/assignments', icon: <ArrowLeftRight size={18} /> },
  { title: 'Workflow', url: '/manager/workflow', icon: <TrendingUp size={18} /> },
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

const ManagerDashboard = () => {
  const { pathname } = useLocation();
  
  const [mechanics, setMechanics] = useState(mockMechanics);
  const [services, setServices] = useState(() => 
    mockServices.map(s => ({
      ...s,
      status: ['in-progress', 'completed'].includes(s.status) ? s.status : 'pending'
    }))
  );
  
  const [assignments, setAssignments] = useState({});
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [newMechanic, setNewMechanic] = useState({ name: '', email: '', specialization: '' });

  // 3-Stage Derived States
  const pendingRequests = services.filter(s => s.status === 'pending');
  const inProgressRequests = services.filter(s => s.status === 'in-progress');
  const completedRequests = services.filter(s => s.status === 'completed');
  const unassignedRequests = pendingRequests.filter(s => !s.mechanicId);
  const completionRate = Math.round((completedRequests.length / services.length) * 100) || 0;

  const handleAssign = (serviceId) => {
    const mechanicId = assignments[serviceId];
    if (!mechanicId) {
      alert("Please select a mechanic first.");
      return;
    }
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, mechanicId } : s));
    alert('Mechanic assigned successfully!');
  };

  const handleAddMechanic = (e) => {
    e.preventDefault();
    if (!newMechanic.name || !newMechanic.email || !newMechanic.specialization) return;
    
    const newMech = {
      id: `m${Date.now()}`,
      name: newMechanic.name,
      email: newMechanic.email,
      specialization: newMechanic.specialization,
      activeJobs: 0,
      completedJobs: 0,
      rating: 5.0 
    };

    setMechanics([...mechanics, newMech]);
    setNewMechanic({ name: '', email: '', specialization: '' }); 
    setShowAddMechanic(false);
    alert(`Account created! Login details have been sent to ${newMech.email}.`);
  };

  const purpleServicesByType = servicesByTypeData.map((item, i) => ({
    ...item,
    fill: ['#4E4FEB', '#34d399', '#fbbf24', '#6A6BFF', '#f87171', '#A1A1AA'][i] || '#4E4FEB',
  }));

  // View 1: Main Dashboard
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Requests" value={services.length} icon={<ClipboardList size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Active Mechanics" value={mechanics.length} icon={<Users size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending" value={pendingRequests.length} icon={<Activity size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={inProgressRequests.length} icon={<Play size={24} />} color="warning" /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 h-100 bg-card">
            <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Weekly Bookings</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="bookings" fill={CHART_PURPLE} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
  
          <div className="col-lg-4">
            {/* Same logic for Pie Chart label sizing if needed, but labels are already 10px */}
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
              <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Revenue Trend</div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: window.innerWidth <= 768 ? 10 : 12, fill: CHART_TEXT }} axisLine={false} tickLine={false} />
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
            
            {/* Table View (Desktop) */}
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
                    const v = mockVehicles.find(v => v.id === s.vehicleId);
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

            {/* Card View (Mobile) */}
            <div className="d-md-none p-3">
              <div className="d-flex flex-column gap-3">
                {services.slice(0, 5).map(s => {
                  const v = mockVehicles.find(v => v.id === s.vehicleId);
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
                        <StatusBadge status={s.priority} />
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
                <div key={m.id} className="d-flex align-items-center justify-content-between p-3 manager-mechanic-card">
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

  // View 2: Requests
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
        
        {/* Table View (Desktop) */}
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
                const vehicle = mockVehicles.find(v => v.id === s.vehicleId);
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

        {/* Card View (Mobile) */}
        <div className="d-md-none p-3">
          <div className="d-flex flex-column gap-3">
            {services.map(s => {
              const vehicle = mockVehicles.find(v => v.id === s.vehicleId);
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

  // View 3: Mechanics
  const renderMechanics = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Mechanics" value={mechanics.length} icon={<Users size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Available" value={mechanics.filter(m => m.activeJobs < 3).length} icon={<CheckCircle2 size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Busy" value={mechanics.filter(m => m.activeJobs >= 3).length} icon={<Activity size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Avg Rating" value={Number((mechanics.reduce((sum, m) => sum + m.rating, 0) / mechanics.length).toFixed(1)) || 0} icon={<Star size={24} />} color="info" /></div>
      </div>
      
      {/* Create Mechanic Form */}
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
          <div className="card-body border-bottom border-opacity-10 pb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <form onSubmit={handleAddMechanic} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Full Name</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  placeholder="e.g. John Doe" 
                  value={newMechanic.name}
                  onChange={e => setNewMechanic({...newMechanic, name: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Email Address</label>
                <input 
                  type="email" 
                  className="form-control py-2" 
                  placeholder="e.g. tech@autocare.com" 
                  value={newMechanic.email}
                  onChange={e => setNewMechanic({...newMechanic, email: e.target.value})}
                  required 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold manager-text-muted text-uppercase mb-2" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Role / Specialty</label>
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
                {/* CHANGED FROM btn-success TO btn-primary */}
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Create Account</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-body d-flex flex-column gap-3">
          {mechanics.map(m => (
            <div key={m.id} className="d-flex align-items-center justify-content-between p-4 manager-mechanic-card transition-hover">
              <div>
                <p className="fw-bold fs-5 mb-0 manager-text-primary">{m.name}</p>
                <p className="mb-0 manager-text-secondary">{m.specialization}</p>
                {m.email && <p className="small mb-0 text-muted mt-1">{m.email}</p>}
              </div>
              <div className="text-end">
                <p className="fw-bold mb-0 manager-text-accent">{m.activeJobs} active jobs</p>
                <p className="small mb-0 d-flex align-items-center justify-content-end gap-1 manager-text-muted mt-1">
                  {m.completedJobs} completed · <Star size={14} className="text-warning" /> {m.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // View 4: Assignments
  const renderAssignments = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Unassigned" value={unassignedRequests.length} icon={<ArrowLeftRight size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending" value={pendingRequests.length} icon={<ClipboardList size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={inProgressRequests.length} icon={<Activity size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Assigned" value={services.filter(s => s.mechanicId && s.status !== 'completed').length} icon={<Users size={24} />} color="success" /></div>
      </div>
      <div className="card border-0 bg-card">
        <div className="card-header fw-bold manager-text-primary border-bottom border-opacity-10">Assignment Board</div>
        
        {/* Table View (Desktop) */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase manager-table-header">Service</th>
                <th className="py-3 small text-uppercase manager-table-header">Status</th>
                <th className="py-3 small text-uppercase manager-table-header">Current Mechanic</th>
                <th className="pe-4 py-3 small text-uppercase manager-table-header">Assign / Reassign</th>
              </tr>
            </thead>
            <tbody>
              {services.filter(s => s.status !== 'completed').map(s => {
                const assignedMechanic = mechanics.find(m => m.id === s.mechanicId);
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium manager-text-primary border-bottom border-opacity-10">{s.serviceType}</td>
                    <td className="border-bottom border-opacity-10"><StatusBadge status={s.status} /></td>
                    <td className="manager-text-secondary border-bottom border-opacity-10">{assignedMechanic?.name || <span className="text-danger small fw-bold">UNASSIGNED</span>}</td>
                    <td className="pe-4 border-bottom border-opacity-10">
                      <div className="d-flex gap-2" style={{ maxWidth: '240px' }}>
                        <select 
                          className="form-select form-select-sm" 
                          value={assignments[s.id] || s.mechanicId || ''} 
                          onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                        >
                          <option value="" disabled>Select mechanic...</option>
                          {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <button className="btn btn-sm btn-outline-primary fw-medium" onClick={() => handleAssign(s.id)}>Save</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card View (Mobile) */}
        <div className="d-md-none p-3">
          <div className="d-flex flex-column gap-3">
            {services.filter(s => s.status !== 'completed').map(s => {
              const assignedMechanic = mechanics.find(m => m.id === s.mechanicId);
              return (
                <div key={s.id} className="card bg-secondary border-0 p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="fw-bold manager-text-primary mb-0">{s.serviceType}</h6>
                    <StatusBadge status={s.status} />
                  </div>
                  
                  <div className="mb-3">
                    <label className="small text-muted-custom mb-1 d-block">Assigned To</label>
                    <div className="small manager-text-secondary fw-semibold">
                      {assignedMechanic?.name || <span className="text-danger">UNASSIGNED</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-top border-opacity-10">
                    <label className="small text-muted-custom mb-2 d-block">Reassign Mechanic</label>
                    <div className="d-flex gap-2">
                      <select 
                        className="form-select form-select-sm" 
                        value={assignments[s.id] || s.mechanicId || ''} 
                        onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                      >
                        <option value="" disabled>Select mechanic...</option>
                        {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <button className="btn btn-sm btn-primary px-3" onClick={() => handleAssign(s.id)}>Save</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  // View 5: Workflow (Kanban Board)
  const renderWorkflow = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending Queue" value={pendingRequests.length} icon={<ClipboardList size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Active Bays" value={inProgressRequests.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed Today" value={completedRequests.length} icon={<CheckCircle2 size={24} />} color="accent" /></div>
      </div>
      
      <div className="row g-4 flex-nowrap overflow-auto pb-3 kanban-scroll-area">
        {[
          { title: 'Pending', status: 'pending', color: 'var(--color-danger)' },
          { title: 'In Progress', status: 'in-progress', color: 'var(--color-warning)' },
          { title: 'Completed', status: 'completed', color: 'var(--color-success)' },
        ].map(column => (
          <div className="col-md-6 col-xl-4 min-w-300" key={column.status}>
            <div className="card border-0 h-100 manager-kanban-column-bg">
              <div className="card-header fw-bold manager-kanban-column-hdr d-flex justify-content-between align-items-center border-bottom border-opacity-10 py-3">
                <span className="d-flex align-items-center gap-2">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: column.color }}></div>
                  {column.title}
                </span>
                <span className="badge bg-secondary text-white rounded-pill px-2">{services.filter(s => s.status === column.status).length}</span>
              </div>
              <div className="card-body d-flex flex-column gap-3">
                {services.filter(s => s.status === column.status).map(s => {
                  const v = mockVehicles.find(v => v.id === s.vehicleId);
                  const m = mechanics.find(m => m.id === s.mechanicId);
                  
                  return (
                    <div key={s.id} className="p-3 manager-kanban-item-card transition-hover position-relative">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <p className="fw-bold mb-0 manager-text-primary lh-1">{s.serviceType}</p>
                        <StatusBadge status={s.priority} />
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 mt-3 text-secondary-custom small">
                        <Car size={14} />
                        <span className="fw-medium">{v ? `${v.make} ${v.model}` : 'Unknown Vehicle'}</span>
                      </div>
                      
                      <hr className="my-2 border-opacity-10" />
                      
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-profile-avatar" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                            {m ? m.name.charAt(0) : '?'}
                          </div>
                          <span className={`small fw-medium ${m ? 'manager-text-primary' : 'text-danger'}`}>
                            {m ? m.name : 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {services.filter(s => s.status === column.status).length === 0 && (
                  <div className="text-center py-4 rounded" style={{ border: '1px dashed var(--border-color)' }}>
                    <p className="small mb-0 manager-text-muted">No jobs in this stage.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const routeMap = {
    '/manager/dashboard': { title: 'Manager Dashboard', description: 'Monitor operations, analyze revenue, and track team performance.', render: renderDashboard },
    '/manager/requests': { title: 'Service Requests', description: 'Review incoming requests and monitor queue health.', render: renderRequests },
    '/manager/mechanics': { title: 'Mechanics Team', description: 'Manage your roster, hire mechanics, and track individual performance.', render: renderMechanics },
    '/manager/assignments': { title: 'Assignments', description: 'Assign and rebalance workloads across your mechanics.', render: renderAssignments },
    '/manager/workflow': { title: 'Workflow Command Center', description: 'Monitor all active bays and track jobs through the 3-stage repair pipeline.', render: renderWorkflow },
  };

  const page = routeMap[pathname] || routeMap['/manager/dashboard'];

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Manager">
      <PageHeader
        title={page.title}
        description={page.description}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />
      {page.render()}
    </DashboardLayout>
  );
};

export default ManagerDashboard;