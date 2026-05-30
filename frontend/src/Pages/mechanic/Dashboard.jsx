import React, { useState, useEffect } from 'react';
import '../../Styles/MechanicPages.css';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../Components/layout/DashboardLayout';
import StatCard from '../../Components/shared/StatCard';
import PageHeader from '../../Components/shared/PageHeader';
import StatusBadge from '../../Components/shared/StatusBadge';
import api from '../../lib/api';
import {
  LayoutDashboard, Briefcase, RefreshCw, FileText,
  CheckCircle2, Play, Camera, Trash2, Image as ImageIcon, Save,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/mechanic/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Assigned Jobs', url: '/mechanic/assigned-jobs', icon: <Briefcase size={18} /> },
  { title: 'Updates', url: '/mechanic/updates', icon: <RefreshCw size={18} /> },
  { title: 'Notes', url: '/mechanic/notes', icon: <FileText size={18} /> },
];

export default function MechanicDashboard() {
  const { pathname } = useLocation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [milestoneInputs, setMilestoneInputs] = useState({});
  const [techInputs, setTechInputs] = useState({});
  const [pictureAttached, setPictureAttached] = useState({});
  const [expandedLog, setExpandedLog] = useState(null);
  const [expandedWorkspace, setExpandedWorkspace] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/mechanic/jobs');
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const activeJobs = services.filter(s => !['completed', 'cancelled'].includes(s.status));
  const inProgress = services.filter(s => s.status === 'in-progress');
  const completedJobs = services.filter(s => s.status === 'completed');
  const pendingJobs = services.filter(s => s.status !== 'in-progress' && s.status !== 'completed' && s.status !== 'cancelled');

  const deleteJob = (id) => {
    if (window.confirm("Remove this completed record from your view?")) {
      setServices(prev => prev.filter(s => s._id !== id));
    }
  };

  const handleFileUpload = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      setPictureAttached(prev => ({ ...prev, [id]: e.target.files[0].name }));
    }
  };

  const handleMilestoneUpdate = async (id) => {
    const note = milestoneInputs[id]?.trim();
    if (!note) {
      alert("Please write a note to log a milestone update.");
      return;
    }
    try {
      const { data } = await api.put(`/mechanic/jobs/${id}/notes`, { note });
      setServices(prev => prev.map(s => s._id === id ? data : s));
      setMilestoneInputs(prev => ({ ...prev, [id]: '' }));
      setPictureAttached(prev => ({ ...prev, [id]: null }));
      alert("Milestone logged!");
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log milestone');
    }
  };

  const handleTechUpdate = async (id) => {
    const note = techInputs[id]?.trim();
    if (!note) return;
    try {
      const { data } = await api.put(`/mechanic/jobs/${id}/notes`, { note });
      setServices(prev => prev.map(s => s._id === id ? data : s));
      setTechInputs(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save technical detail');
    }
  };

  const handleValidatedUpdate = async (id, targetStatus) => {
    if (targetStatus === 'in-progress') {
      const currentlyActive = services.find(s => s.status === 'in-progress');
      if (currentlyActive && currentlyActive._id !== id) {
        alert(`You are currently working on "${currentlyActive.serviceType}". Please complete it before starting a new job.`);
        return;
      }
    }

    const note = milestoneInputs[id]?.trim();
    const hasPicture = pictureAttached[id];

    if (targetStatus === 'completed' && (!note || !hasPicture)) {
      alert("COMPULSORY: You must write a final milestone note AND attach a picture of the work to complete this job.");
      return;
    }

    try {
      if (note) {
        await api.put(`/mechanic/jobs/${id}/notes`, { note });
        setMilestoneInputs(prev => ({ ...prev, [id]: '' }));
      }
      const { data } = await api.put(`/mechanic/jobs/${id}/status`, { status: targetStatus });
      setServices(prev => prev.map(s => s._id === id ? data : s));

      if (targetStatus === 'in-progress') {
        setExpandedWorkspace(prev => ({ ...prev, [id]: true }));
      }
      if (targetStatus === 'completed') {
        alert('Job successfully marked as Completed!');
        setExpandedWorkspace(prev => ({ ...prev, [id]: false }));
        setPictureAttached(prev => ({ ...prev, [id]: null }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job');
    }
  };

  const renderNotesList = (notes) => (
    <ul className="mb-0 small ps-1 mechanic-text-secondary list-unstyled">
      {notes.map((note, i) => (
        <li key={i} className="mb-2 d-flex align-items-start gap-2">
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', marginTop: '6px', flexShrink: 0 }}></div>
          <span className="mechanic-text-primary">{note}</span>
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems} sectionLabel="Mechanic">
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Assigned Jobs" value={activeJobs.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold mb-3 mechanic-text-primary">Assigned Jobs</h5>
        <div className="d-flex flex-column gap-3">
          {activeJobs.length === 0 ? (
            <div className="text-center py-5 text-muted-custom">No active jobs assigned.</div>
          ) : activeJobs.map(s => {
            const v = s.vehicleId;
            const isPending = s.status !== 'in-progress' && s.status !== 'completed';
            return (
              <div key={s._id} className="card border-0">
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-between gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 className="fw-bold mb-0 mechanic-text-primary" style={{ fontSize: '1rem' }}>{s.serviceType}</h6>
                        <StatusBadge status={isPending ? 'pending' : s.status} />
                        <StatusBadge status={s.priority} />
                      </div>
                      <p className="small mb-1 mechanic-text-secondary">
                        {v ? `${v.year} ${v.make} ${v.model} · ${v.plate}` : '—'}
                      </p>
                      <p className="small mb-0 mechanic-text-muted">{s.description}</p>
                    </div>
                    <div className="d-flex flex-column flex-sm-row gap-2 mt-2 mt-sm-0">
                      {isPending && <button className="btn btn-sm btn-warning d-flex align-items-center justify-content-center gap-1" onClick={() => handleValidatedUpdate(s._id, 'in-progress')} style={{ color: '#0f0e17' }}><Play size={14} /> Start Work</button>}
                      {s.status === 'in-progress' && <button className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-1" onClick={() => handleValidatedUpdate(s._id, 'completed')}><CheckCircle2 size={14} /> Complete</button>}
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

  const renderAssignedJobs = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Total Assigned" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Finished" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="card border-0">
        <div className="card-header fw-bold py-3 mechanic-text-primary">Assigned Jobs Queue</div>

        {/* Desktop */}
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="ps-4 py-3 small text-uppercase mechanic-table-header">Service</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Vehicle</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Priority</th>
                <th className="py-3 small text-uppercase mechanic-table-header">Status</th>
                <th className="pe-4 py-3 small text-uppercase mechanic-table-header">Customer</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-muted-custom">No jobs currently in queue.</td></tr>
              ) : services.map(s => {
                const v = s.vehicleId;
                const isPending = s.status !== 'in-progress' && s.status !== 'completed';
                return (
                  <tr key={s._id}>
                    <td className="ps-4 fw-medium mechanic-text-primary">{s.serviceType}</td>
                    <td className="mechanic-text-secondary">{v ? `${v.make} ${v.model}` : '—'}</td>
                    <td><StatusBadge status={s.priority} /></td>
                    <td><StatusBadge status={isPending ? 'pending' : s.status} /></td>
                    <td className="pe-4 small mechanic-text-muted">{s.customerId?.name || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="d-md-none p-3">
          {services.length === 0 ? (
            <div className="text-center py-5 text-muted-custom">No jobs currently in queue.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {services.map(s => {
                const v = s.vehicleId;
                const isPending = s.status !== 'in-progress' && s.status !== 'completed';
                return (
                  <div key={s._id} className="card bg-secondary border-0 p-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mechanic-text-primary mb-1">{s.serviceType}</h6>
                      <StatusBadge status={isPending ? 'pending' : s.status} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted-custom">Vehicle</span>
                      <span className="small mechanic-text-secondary">{v ? `${v.make} ${v.model}` : '—'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-muted-custom">Priority</span>
                      <StatusBadge status={s.priority} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-opacity-10">
                      <span className="small text-muted-custom">Customer</span>
                      <span className="small mechanic-text-muted">{s.customerId?.name || '—'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderUpdates = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Pending" value={pendingJobs.length} icon={<Briefcase size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="d-flex flex-column gap-3 gap-md-4 mt-4">
        {services.map(s => {
          const v = s.vehicleId;
          const isCompleted = s.status === 'completed';
          const isInProgress = s.status === 'in-progress';
          const isPending = !isCompleted && !isInProgress;

          return (
            <div key={s._id} className="card border-0">
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1 mechanic-text-primary d-flex align-items-center gap-2">
                      {s.serviceType}
                      <StatusBadge status={isPending ? 'pending' : s.status} />
                    </h6>
                    <p className="small mb-0 mechanic-text-secondary">{v ? `${v.year} ${v.make} ${v.model}` : '—'}</p>
                  </div>
                  {isCompleted && (
                    <button className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center gap-1" onClick={() => deleteJob(s._id)} title="Delete Record">
                      <Trash2 size={14} /> <span className="d-none d-sm-inline">Delete Record</span>
                    </button>
                  )}
                </div>

                {isInProgress && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <button
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedWorkspace(prev => ({ ...prev, [s._id]: !prev[s._id] }))}
                    >
                      {expandedWorkspace[s._id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedWorkspace[s._id] ? 'Hide Workspace' : 'Update Job Progress'}
                    </button>

                    {expandedWorkspace[s._id] && (
                      <div className="mechanic-notes-wrapper p-2 p-md-3 mt-3">
                        {s.notes.length > 0 && (
                          <div className="mb-3 p-2 p-md-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                            <p className="small fw-bold text-uppercase mb-2 text-muted" style={{ fontSize: 'min(0.65rem, 3vw)' }}>Job History</p>
                            {renderNotesList(s.notes)}
                          </div>
                        )}

                        <label className="small fw-bold text-uppercase mb-2 mechanic-table-header w-100 px-0">Log New Milestone</label>
                        <textarea
                          className="form-control form-control-sm mb-3"
                          placeholder="What did you just complete?..."
                          value={milestoneInputs[s._id] || ''}
                          onChange={e => setMilestoneInputs(prev => ({ ...prev, [s._id]: e.target.value }))}
                          rows={window.innerWidth <= 480 ? 2 : 3}
                        ></textarea>

                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <input type="file" id={`file-${s._id}`} className="d-none" accept="image/*" onChange={e => handleFileUpload(s._id, e)} />
                              <label htmlFor={`file-${s._id}`} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 m-0 cursor-pointer">
                                <Camera size={14} />
                                <span className="d-none d-sm-inline">{pictureAttached[s._id] ? 'Change Photo' : 'Attach Photo'}</span>
                                <span className="d-inline d-sm-none">{pictureAttached[s._id] ? 'Change' : 'Photo'}</span>
                              </label>
                              {pictureAttached[s._id] && (
                                <span className="small text-success d-flex align-items-center gap-1 fw-medium">
                                  <ImageIcon size={14} /> <span className="d-none d-sm-inline">Attached</span>
                                </span>
                              )}
                            </div>

                            <div className="d-flex flex-column flex-sm-row gap-2 flex-grow-1 flex-sm-grow-0">
                              <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center gap-1 flex-grow-1" onClick={() => handleMilestoneUpdate(s._id)}>
                                <Save size={14} /> Log Milestone
                              </button>
                              <button className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-1 flex-grow-1" onClick={() => handleValidatedUpdate(s._id, 'completed')}>
                                <CheckCircle2 size={14} /> Complete Job
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isPending && (
                  <div className="d-flex justify-content-end border-top border-opacity-10 pt-3 mt-2">
                    <button
                      className="btn btn-sm btn-warning d-flex align-items-center justify-content-center gap-1 w-100-mobile"
                      onClick={() => handleValidatedUpdate(s._id, 'in-progress')}
                      style={{ color: '#0f0e17' }}
                    >
                      <Play size={14} /> Start Work
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <button
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedLog(expandedLog === s._id ? null : s._id)}
                    >
                      {expandedLog === s._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedLog === s._id ? 'Hide Job Log' : 'View Job Log'}
                    </button>

                    {expandedLog === s._id && (
                      <div className="mechanic-notes-wrapper p-3 mt-3">
                        <p className="small fw-bold text-uppercase mb-3 text-muted" style={{ fontSize: '0.65rem' }}>Completion Log</p>
                        {s.notes.length > 0 ? renderNotesList(s.notes) : (
                          <p className="small text-muted mb-0">No notes were captured for this job.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderNotes = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Active Services" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Total Assigned" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>

      <div className="d-flex flex-column gap-3 mt-4">
        {inProgress.length > 0 ? (
          inProgress.map(s => {
            const v = s.vehicleId;
            return (
              <div key={s._id} className="card border-0">
                <div className="card-header fw-bold py-3 mechanic-text-primary d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    {s.serviceType}
                    <StatusBadge status={s.status} />
                  </div>
                  <span className="small text-muted">{v ? `${v.make} ${v.model}` : ''}</span>
                </div>
                <div className="card-body p-3 p-md-4">
                  {s.notes.length > 0 && (
                    <div className="p-3 mb-4 mechanic-notes-wrapper">
                      <p className="small fw-bold text-uppercase mb-3 mechanic-table-header">Current Job History</p>
                      {renderNotesList(s.notes)}
                    </div>
                  )}

                  <div className="d-flex flex-column gap-3 mt-3">
                    <label className="small fw-bold text-uppercase mechanic-table-header px-0 mb-0">Add Technical Detail</label>
                    <p className="small text-muted mb-0">This will be saved as a note on this job.</p>
                    <textarea
                      className="form-control"
                      placeholder="e.g., Found metal shavings in oil pan, recommended customer change filter brand..."
                      value={techInputs[s._id] || ''}
                      onChange={e => setTechInputs(prev => ({ ...prev, [s._id]: e.target.value }))}
                      rows={3}
                    ></textarea>
                    <div className="d-flex justify-content-end mt-1">
                      <button className="btn btn-primary btn-sm px-4 d-flex align-items-center gap-2" onClick={() => handleTechUpdate(s._id)}>
                        <Save size={14} /> Save Technical Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card border-0 bg-transparent">
            <div className="card-body py-5 text-center" style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
              <AlertCircle size={48} className="text-muted mb-3 opacity-50" />
              <h5 className="fw-bold mechanic-text-primary mb-2">No Active Workbays</h5>
              <p className="text-muted small mb-0">You must start a job in the Updates tab before you can add technical notes here.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const routeMap = {
    '/mechanic/dashboard': { title: 'Mechanic Dashboard', description: 'Manage your assigned jobs and track progress.', render: renderDashboard },
    '/mechanic/assigned-jobs': { title: 'Assigned Jobs', description: 'Review every assigned request in your queue.', render: renderAssignedJobs },
    '/mechanic/updates': { title: 'Status Updates', description: 'Move jobs forward. Log major milestones and upload required photos.', render: renderUpdates },
    '/mechanic/notes': { title: 'Technical Notes', description: 'Capture detailed diagnostics and attach them to your active jobs.', render: renderNotes },
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
