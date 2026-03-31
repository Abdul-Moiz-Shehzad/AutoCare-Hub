import React, { useState } from 'react';
import '../../Styles/MechanicPages.css';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import StatCard from '../../Components/shared/StatCard';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import { mockServices, mockVehicles } from '../../data/mockData';
import { 
  LayoutDashboard, Briefcase, RefreshCw, FileText,
  CheckCircle2, Play, Eye, ArrowRightCircle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/mechanic/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Assigned Jobs', url: '/mechanic/assigned-jobs', icon: <Briefcase size={18} /> },
  { title: 'Updates', url: '/mechanic/updates', icon: <RefreshCw size={18} /> },
  { title: 'Notes', url: '/mechanic/notes', icon: <FileText size={18} /> },
];

const MechanicDashboard = () => {
  const { pathname } = useLocation();
  const [services, setServices] = useState(mockServices.filter(s => s.mechanicId === 'u2'));
  const [noteInputs, setNoteInputs] = useState({});

  const activeJobs = services.filter(s => !['completed', 'cancelled'].includes(s.status));
  const inProgress = services.filter(s => s.status === 'in-progress');
  const completedToday = services.filter(s => s.status === 'completed');

  const updateStatus = (id, status) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    alert(`Status successfully updated to: ${status}`);
  };

  const addNote = (id) => {
    const note = noteInputs[id]?.trim();
    if (!note) return;
    setServices(prev => prev.map(s => s.id === id ? { ...s, notes: [...s.notes, note] } : s));
    setNoteInputs(prev => ({ ...prev, [id]: '' }));
    alert('Note added successfully!');
  };

  // View 1: Main Dashboard
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Assigned Jobs" value={activeJobs.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<RefreshCw size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedToday.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold mb-3 mechanic-text-primary">Assigned Jobs</h5>
        <div className="d-flex flex-column gap-3">
          {activeJobs.map(s => {
            const v = mockVehicles.find(v => v.id === s.vehicleId);
            return (
              <div key={s.id} className="card border-0">
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-between gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="fw-bold mb-0 mechanic-text-primary">{s.serviceType}</h5>
                        <StatusBadge status={s.status} />
                        <StatusBadge status={s.priority} />
                      </div>
                      <p className="small mb-1 mechanic-text-secondary">
                        {v ? `${v.year} ${v.make} ${v.model} · ${v.plate}` : '—'}
                      </p>
                      <p className="small mb-0 mechanic-text-muted">{s.description}</p>
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-sm-0">
                      {s.status === 'pending' && <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'received')}><ArrowRightCircle size={14} /> Received</button>}
                      {s.status === 'received' && <button className="btn btn-sm btn-info text-white d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'diagnosed')}><Eye size={14} /> Diagnosed</button>}
                      {s.status === 'diagnosed' && <button className="btn btn-sm btn-warning d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'in-progress')} style={{ color: '#0f0e17' }}><Play size={14} /> Start Work</button>}
                      {s.status === 'in-progress' && <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'completed')}><CheckCircle2 size={14} /> Complete</button>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );

  // View 2: Assigned Jobs Table
  const renderAssignedJobs = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Total Assigned" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Awaiting Parts" value={services.filter(s => s.status === 'diagnosed').length} icon={<RefreshCw size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Finished" value={services.filter(s => s.status === 'completed').length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="card border-0">
        <div className="card-header fw-bold py-3 mechanic-text-primary">Assigned Jobs Queue</div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase mechanic-table-header">Service</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Vehicle</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Priority</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Status</th>
                <th className="pe-4 py-3 small text-uppercase mechanic-table-header">Updated</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => {
                const vehicle = mockVehicles.find(v => v.id === s.vehicleId);
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium mechanic-text-primary">{s.serviceType}</td>
                    <td className="mechanic-text-secondary">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</td>
                    <td><StatusBadge status={s.priority} /></td>
                    <td><StatusBadge status={s.status} /></td>
                    <td className="pe-4 small mechanic-text-muted">{s.updatedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  // View 3: Updates View
  const renderUpdates = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Pending" value={services.filter(s => s.status === 'pending').length} icon={<Briefcase size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Received" value={services.filter(s => s.status === 'received').length} icon={<RefreshCw size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Diagnosed" value={services.filter(s => s.status === 'diagnosed').length} icon={<Eye size={24} />} color="accent" /></div>
      </div>
      <div className="d-flex flex-column gap-3 mt-4">
        {activeJobs.map(s => {
          const v = mockVehicles.find(v => v.id === s.vehicleId);
          return (
            <div key={s.id} className="card border-0">
              <div className="card-body p-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                <div>
                  <h6 className="fw-bold mb-1 mechanic-text-primary">{s.serviceType}</h6>
                  <p className="small mb-0 mechanic-text-secondary">{v ? `${v.make} ${v.model}` : '—'}</p>
                </div>
                <div className="d-flex gap-2">
                  {s.status === 'pending' && <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'received')}><ArrowRightCircle size={14} /> Received</button>}
                  {s.status === 'received' && <button className="btn btn-sm btn-info text-white d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'diagnosed')}><Eye size={14} /> Diagnosed</button>}
                  {s.status === 'diagnosed' && <button className="btn btn-sm btn-warning d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'in-progress')} style={{ color: '#0f0e17' }}><Play size={14} /> Start Work</button>}
                  {s.status === 'in-progress' && <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => updateStatus(s.id, 'completed')}><CheckCircle2 size={14} /> Complete</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  // View 4: Notes
  const renderNotes = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Jobs with Notes" value={services.filter(s => s.notes.length > 0).length} icon={<FileText size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Total Notes" value={services.reduce((sum, s) => sum + s.notes.length, 0)} icon={<RefreshCw size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Need Notes" value={services.filter(s => s.notes.length === 0).length} icon={<Briefcase size={24} />} color="danger" /></div>
      </div>
      <div className="d-flex flex-column gap-3 mt-4">
        {services.map(s => (
          <div key={s.id} className="card border-0">
            <div className="card-header fw-bold py-3 mechanic-text-primary">{s.serviceType}</div>
            <div className="card-body p-4">
              {s.notes.length > 0 && (
                <div className="p-3 mb-3 mechanic-notes-wrapper">
                  <p className="small fw-bold text-uppercase mb-2 mechanic-table-header">Notes</p>
                  <ul className="mb-0 small ps-3 mechanic-text-secondary">
                    {s.notes.map((n, i) => <li key={i} className="mb-1">{n}</li>)}
                  </ul>
                </div>
              )}
              <div className="d-flex gap-2 align-items-start mt-3">
                <textarea
                  className="form-control form-control-sm"
                  placeholder="Add a new diagnostic or progress note..."
                  value={noteInputs[s.id] || ''}
                  onChange={e => setNoteInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                  rows={2}
                ></textarea>
                <button className="btn btn-outline-primary btn-sm px-3" onClick={() => addNote(s.id)}>Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const routeMap = {
    '/mechanic/dashboard': { title: 'Mechanic Dashboard', description: 'Manage your assigned jobs and track progress.', render: renderDashboard },
    '/mechanic/assigned-jobs': { title: 'Assigned Jobs', description: 'Review every assigned request in your queue.', render: renderAssignedJobs },
    '/mechanic/updates': { title: 'Status Updates', description: 'Move jobs forward by updating current status.', render: renderUpdates },
    '/mechanic/notes': { title: 'Service Notes', description: 'Capture diagnostics and progress notes per job.', render: renderNotes },
  };

  const page = routeMap[pathname] || routeMap['/mechanic/dashboard'];

  return (
    <DashboardLayout menuItems={menuItems} sectionLabel="Mechanic">
      <PageHeader
        title={page.title}
        description={page.description}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />
      {page.render()}
    </DashboardLayout>
  );
};

export default MechanicDashboard;