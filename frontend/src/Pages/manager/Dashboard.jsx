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
  Activity, Star, CheckCircle2
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/manager/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Requests', url: '/manager/requests', icon: <ClipboardList size={18} /> },
  { title: 'Mechanics', url: '/manager/mechanics', icon: <Users size={18} /> },
  { title: 'Assignments', url: '/manager/assignments', icon: <ArrowLeftRight size={18} /> },
  { title: 'Workflow', url: '/manager/workflow', icon: <TrendingUp size={18} /> },
];

// Custom chart colors for dark/purple theme
const CHART_PURPLE = '#a78bfa';
const CHART_GREEN = '#34d399';
const CHART_GRID = 'rgba(167, 139, 250, 0.1)';
const CHART_TEXT = '#6b6783';

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
  const [assignments, setAssignments] = useState({});
  
  const pendingRequests = mockServices.filter(s => s.status === 'pending');
  const activeRequests = mockServices.filter(s => !['completed', 'cancelled'].includes(s.status));
  const unassignedRequests = mockServices.filter(s => !s.mechanicId && !['completed', 'cancelled'].includes(s.status));
  const completionRate = Math.round((mockServices.filter(s => s.status === 'completed').length / mockServices.length) * 100) || 0;

  const handleAssign = (serviceId) => {
    if (!assignments[serviceId]) return;
    alert('Mechanic assigned successfully!');
  };

  // Updated pie chart colors for purple theme
  const purpleServicesByType = servicesByTypeData.map((item, i) => ({
    ...item,
    fill: ['#a78bfa', '#34d399', '#fbbf24', '#8b5cf6', '#f87171', '#6b6783'][i] || '#a78bfa',
  }));

  // View 1: Main Dashboard
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Requests" value={mockServices.length} icon={<ClipboardList size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Active Mechanics" value={mockMechanics.length} icon={<Users size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending" value={pendingRequests.length} icon={<Activity size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed Today" value={3} icon={<CheckCircle2 size={24} />} color="danger" /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header fw-bold manager-text-primary">Weekly Bookings</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: CHART_TEXT }} />
                  <YAxis tick={{ fontSize: 12, fill: CHART_TEXT }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" fill={CHART_PURPLE} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header fw-bold manager-text-primary">Services by Type</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={purpleServicesByType} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {purpleServicesByType.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header fw-bold manager-text-primary">Revenue Trend</div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: CHART_TEXT }} />
                  <YAxis tick={{ fontSize: 12, fill: CHART_TEXT }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke={CHART_GREEN} strokeWidth={2} dot={{ fill: CHART_GREEN, r: 4 }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#0f0e17' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 h-100">
            <div className="card-header fw-bold manager-text-primary">Recent Requests</div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4 py-3 small text-uppercase manager-table-header">Service</th>
                    <th className="py-3 small text-uppercase manager-table-header">Vehicle</th>
                    <th className="py-3 small text-uppercase manager-table-header">Priority</th>
                    <th className="py-3 small text-uppercase manager-table-header">Status</th>
                    <th className="pe-4 py-3 small text-uppercase manager-table-header">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {mockServices.slice(0, 5).map(s => {
                    const v = mockVehicles.find(v => v.id === s.vehicleId);
                    return (
                      <tr key={s.id}>
                        <td className="ps-4 fw-medium manager-text-primary">{s.serviceType}</td>
                        <td className="manager-text-secondary">{v ? `${v.make} ${v.model}` : '—'}</td>
                        <td><StatusBadge status={s.priority} /></td>
                        <td><StatusBadge status={s.status} /></td>
                        <td className="pe-4">
                          <div className="d-flex gap-2">
                            <select 
                              className="form-select form-select-sm manager-select-assign" 
                              value={assignments[s.id] || ''} 
                              onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                            >
                              <option value="" disabled>Assign</option>
                              {mockMechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleAssign(s.id)}>Go</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 h-100">
            <div className="card-header fw-bold manager-text-primary">Mechanic Workload</div>
            <div className="card-body d-flex flex-column gap-3">
              {mockMechanics.map(m => (
                <div key={m.id} className="d-flex align-items-center justify-content-between p-3 manager-mechanic-card">
                  <div>
                    <p className="fw-bold mb-0 manager-text-primary">{m.name}</p>
                    <p className="small mb-0 manager-text-muted">{m.specialization}</p>
                  </div>
                  <div className="text-end">
                    <p className="small fw-bold mb-0 manager-text-accent">{m.activeJobs} active</p>
                    <p className="small mb-0 d-flex align-items-center justify-content-end gap-1 manager-text-muted">
                      <Star size={12} className="manager-mechanic-rating" /> {m.rating}
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
        <div className="col-sm-6 col-lg-3"><StatCard title="Open Requests" value={activeRequests.length} icon={<ClipboardList size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Pending Review" value={pendingRequests.length} icon={<Activity size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Urgent" value={mockServices.filter(s => s.priority === 'urgent').length} icon={<ArrowLeftRight size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed" value={mockServices.filter(s => s.status === 'completed').length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="card border-0">
        <div className="card-header fw-bold manager-text-primary">All Service Requests</div>
        <div className="table-responsive">
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
              {mockServices.map(s => {
                const vehicle = mockVehicles.find(v => v.id === s.vehicleId);
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium manager-text-primary">{s.serviceType}</td>
                    <td className="manager-text-secondary">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</td>
                    <td><StatusBadge status={s.priority} /></td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="pe-4 small manager-text-muted">{s.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // View 3: Mechanics
  const renderMechanics = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Mechanics" value={mockMechanics.length} icon={<Users size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Available" value={mockMechanics.filter(m => m.activeJobs < 3).length} icon={<Activity size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Busy" value={mockMechanics.filter(m => m.activeJobs >= 3).length} icon={<ClipboardList size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Avg Rating" value={Number((mockMechanics.reduce((sum, m) => sum + m.rating, 0) / mockMechanics.length).toFixed(1))} icon={<Star size={24} />} color="danger" /></div>
      </div>
      <div className="card border-0">
        <div className="card-header fw-bold manager-text-primary">Team Performance</div>
        <div className="card-body d-flex flex-column gap-3">
          {mockMechanics.map(m => (
            <div key={m.id} className="d-flex align-items-center justify-content-between p-4 manager-mechanic-card">
              <div>
                <p className="fw-bold fs-5 mb-0 manager-text-primary">{m.name}</p>
                <p className="mb-0 manager-text-secondary">{m.specialization}</p>
              </div>
              <div className="text-end">
                <p className="fw-bold mb-0 manager-text-accent">{m.activeJobs} active jobs</p>
                <p className="small mb-0 d-flex align-items-center justify-content-end gap-1 manager-text-muted">
                  {m.completedJobs} completed · <Star size={12} className="manager-mechanic-rating" /> {m.rating}
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
        <div className="col-sm-6 col-lg-3"><StatCard title="Ready to Start" value={mockServices.filter(s => s.status === 'received' || s.status === 'diagnosed').length} icon={<ClipboardList size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={mockServices.filter(s => s.status === 'in-progress').length} icon={<Activity size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Assigned" value={mockServices.filter(s => s.mechanicId).length} icon={<Users size={24} />} color="success" /></div>
      </div>
      <div className="card border-0">
        <div className="card-header fw-bold manager-text-primary">Assignment Board</div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase manager-table-header">Service</th>
                <th className="py-3 small text-uppercase manager-table-header">Status</th>
                <th className="py-3 small text-uppercase manager-table-header">Current Mechanic</th>
                <th className="pe-4 py-3 small text-uppercase manager-table-header">Reassign</th>
              </tr>
            </thead>
            <tbody>
              {activeRequests.map(s => {
                const assignedMechanic = mockMechanics.find(m => m.id === s.mechanicId);
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium manager-text-primary">{s.serviceType}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="manager-text-secondary">{assignedMechanic?.name || 'Unassigned'}</td>
                    <td className="pe-4">
                      <div className="d-flex gap-2" style={{ maxWidth: '200px' }}>
                        <select 
                          className="form-select form-select-sm" 
                          value={assignments[s.id] || s.mechanicId || ''} 
                          onChange={e => setAssignments(p => ({ ...p, [s.id]: e.target.value }))}
                        >
                          <option value="" disabled>Select mechanic</option>
                          {mockMechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleAssign(s.id)}>Save</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // View 5: Workflow (Kanban Board)
  const renderWorkflow = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3"><StatCard title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp size={24} />} color="success" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Diagnosed" value={mockServices.filter(s => s.status === 'diagnosed').length} icon={<ClipboardList size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={mockServices.filter(s => s.status === 'in-progress').length} icon={<ArrowLeftRight size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Backlog" value={pendingRequests.length} icon={<Activity size={24} />} color="danger" /></div>
      </div>
      <div className="row g-4">
        {[
          { title: 'Pending', status: 'pending' },
          { title: 'Received', status: 'received' },
          { title: 'Diagnosed', status: 'diagnosed' },
          { title: 'In Progress', status: 'in-progress' },
          { title: 'Completed', status: 'completed' },
        ].map(column => (
          <div className="col-md-6 col-xl-4" key={column.status}>
            <div className="card border-0 h-100 manager-kanban-column-bg">
              <div className="card-header fw-bold manager-kanban-column-hdr">{column.title}</div>
              <div className="card-body d-flex flex-column gap-2">
                {mockServices.filter(s => s.status === column.status).map(s => (
                  <div key={s.id} className="p-3 manager-kanban-item-card">
                    <p className="fw-bold mb-1 manager-text-primary">{s.serviceType}</p>
                    <p className="small mb-0 manager-text-muted">{s.description}</p>
                  </div>
                ))}
                {mockServices.filter(s => s.status === column.status).length === 0 && (
                  <p className="small mb-0 text-center py-3 manager-text-muted">No items in this stage.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const routeMap = {
    '/manager/dashboard': { title: 'Manager Dashboard', description: 'Monitor operations, assign mechanics, and track performance.', render: renderDashboard },
    '/manager/requests': { title: 'Service Requests', description: 'Review incoming requests and monitor queue health.', render: renderRequests },
    '/manager/mechanics': { title: 'Mechanics Team', description: 'Track mechanic capacity and individual performance.', render: renderMechanics },
    '/manager/assignments': { title: 'Assignments', description: 'Assign and rebalance workloads across mechanics.', render: renderAssignments },
    '/manager/workflow': { title: 'Workflow', description: 'Follow service jobs through each workflow stage.', render: renderWorkflow },
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