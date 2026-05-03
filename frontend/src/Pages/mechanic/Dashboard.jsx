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
  CheckCircle2, Play, Camera, Image as ImageIcon, Save,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Assigned Jobs', url: '/assigned-jobs', icon: <Briefcase size={18} /> },
  { title: 'Updates', url: '/updates', icon: <RefreshCw size={18} /> },
  { title: 'Notes', url: '/notes', icon: <FileText size={18} /> },
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

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const currentUserId = userInfo._id || userInfo.id;

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

  const activeJobs = services.filter(s => !['completed', 'picked-up', 'cancelled'].includes(s.status));
  const inProgress = services.filter(s => s.status === 'in-progress');
  const reviewPending = services.filter(s => s.status === 'review-pending');
  const completedJobs = services.filter(s => s.status === 'completed' || s.status === 'picked-up');
  const pendingJobs = services.filter(s => s.status === 'pending');


  const handleFileUpload = async (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const baseUrl = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000';
        setPictureAttached(prev => ({ ...prev, [id]: `${baseUrl}${data.imagePath}` }));
      } catch (err) {
        alert('Failed to upload image');
      }
    }
  };

  const handleMilestoneUpdate = async (id) => {
    const milestone = milestoneInputs[id]?.trim();
    if (!milestone) {
      alert("Please write a milestone note to log an update.");
      return;
    }
    try {
      const { data } = await api.put(`/mechanic/jobs/${id}/milestones`, { 
        milestone, 
        image: pictureAttached[id] || null 
      });
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
      alert("Note added to pending milestone!");
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
      // Send the status update along with the milestone and picture filename
      const { data } = await api.put(`/mechanic/jobs/${id}/status`, { 
        status: targetStatus,
        milestone: note || null, // Final milestone heading
        completionImage: pictureAttached[id] || null 
      });
      
      setServices(prev => prev.map(s => s._id === id ? data : s));
      setMilestoneInputs(prev => ({ ...prev, [id]: '' }));

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

  const [editingLog, setEditingLog] = useState({ id: null, index: null, text: '' });

  const handleEditLog = (serviceId, logIndex, currentText) => {
    setEditingLog({ id: serviceId, index: logIndex, text: currentText });
  };

  const saveLogEdit = async (serviceId) => {
    const service = services.find(s => s._id === serviceId);
    const newLogs = [...service.logs];
    newLogs[editingLog.index] = { ...newLogs[editingLog.index], milestone: editingLog.text };

    try {
      const { data } = await api.put(`/mechanic/jobs/${serviceId}/logs`, { logs: newLogs });
      setServices(prev => prev.map(s => s._id === serviceId ? data : s));
      setEditingLog({ id: null, index: null, text: '' });
    } catch (err) {
      alert("Failed to save edit");
    }
  };

  const renderNotesList = (service) => {
    const { logs, pendingNotes, _id: serviceId } = service;
    
    // Filter logs to only show those where technicianId matches current user
    const filteredLogs = logs?.filter(log => {
      const techId = log.technicianId?._id || log.technicianId;
      return techId === currentUserId;
    }) || [];

    return (
      <div className="d-flex flex-column gap-3">
        {filteredLogs.length > 0 && filteredLogs.map((log, i) => (
          <div key={i} className="mechanic-log-entry">
            <div className="d-flex align-items-start justify-content-between gap-2">
              <div className="d-flex align-items-start gap-2 flex-grow-1">
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', marginTop: '6px', flexShrink: 0 }}></div>
                <div className="flex-grow-1">
                  {editingLog.id === serviceId && editingLog.index === i ? (
                    <div className="d-flex gap-2">
                      <input
                        className="form-control form-control-sm"
                        value={editingLog.text}
                        onChange={e => setEditingLog({ ...editingLog, text: e.target.value })}
                      />
                      <button className="btn btn-sm btn-success" onClick={() => saveLogEdit(serviceId)}><Save size={12} /></button>
                    </div>
                  ) : (
                    <span className="fw-bold mechanic-text-primary" onDoubleClick={() => handleEditLog(serviceId, i, log.milestone)}>{log.milestone}</span>
                  )}
                  {log.notes && log.notes.length > 0 && (
                    <ul className="list-unstyled mt-1 mb-0 ps-3">
                      {log.notes.map((n, ni) => (
                        <li key={ni} className="small text-muted d-flex flex-column gap-0 mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }}></span>
                            <span>{n.text}</span>
                          </div>
                          {n.authorId && n.authorId._id !== currentUserId && (
                            <span className="ms-3" style={{ fontSize: '0.6rem', opacity: 0.6 }}>— {n.authorId.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {log.image && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 py-0 px-2"
                        onClick={() => window.open(log.image)}
                        style={{ fontSize: '0.65rem', height: '20px' }}
                      >
                        <Camera size={10} /> View Attached Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>{new Date(log.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {pendingNotes && pendingNotes.length > 0 && (
          <div className="p-2 rounded border border-warning border-opacity-25 bg-warning bg-opacity-10">
            <p className="small fw-bold text-warning mb-1 text-uppercase" style={{ fontSize: '0.6rem' }}>Current Drafts</p>
            <ul className="list-unstyled mb-0 ps-2">
              {pendingNotes.map((n, ni) => (
                <li key={ni} className="small text-muted-custom d-flex flex-column gap-0 mb-1">
                   <div className="d-flex align-items-center gap-2">
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span>
                    <span>{n.text}</span>
                   </div>
                   {n.authorId && n.authorId._id !== currentUserId && (
                     <span className="ms-3" style={{ fontSize: '0.6rem', opacity: 0.6 }}>— {n.authorId.name}</span>
                   )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {filteredLogs.length === 0 && (!pendingNotes || pendingNotes.length === 0) && (
          <p className="small text-muted-custom text-center py-2 mb-0">No logs contributed by you yet.</p>
        )}
      </div>
    );
  };

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
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Jobs" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="For Review" value={reviewPending.length} icon={<RefreshCw size={24} />} color="info" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold mb-3 mechanic-text-primary">Assigned Jobs</h5>
        <div className="d-flex flex-column gap-3">
          {activeJobs.length === 0 ? (
            <div className="text-center py-5 text-muted-custom">No active jobs assigned.</div>
          ) : activeJobs.map(s => {
            const v = s.vehicleId;
            const isPending = s.status === 'pending';
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
                      {s.status === 'in-progress' && <button className="btn btn-sm btn-success d-flex align-items-center justify-content-center gap-1" onClick={() => handleValidatedUpdate(s._id, 'completed')} style={{ borderRadius: 'var(--radius)' }}><CheckCircle2 size={14} /> Complete</button>}
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
        <div className="col-sm-6 col-lg-3"><StatCard title="Total Jobs" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="For Review" value={reviewPending.length} icon={<RefreshCw size={24} />} color="info" /></div>
        <div className="col-sm-6 col-lg-3"><StatCard title="Completed" value={completedJobs.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
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
          const isCompleted = s.status === 'completed' || s.status === 'picked-up';
          const isInProgress = s.status === 'in-progress';
          const isReviewPending = s.status === 'review-pending';
          const isPending = s.status === 'pending' || s.status === 'received';
          const isAssignedToMe = s.mechanicId === currentUserId || (s.mechanicId && s.mechanicId._id === currentUserId);

          return (
            <div key={s._id} className="card border-0">
              <div className="card-body p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1 mechanic-text-primary d-flex align-items-center gap-2">
                      {s.serviceType}
                      <StatusBadge status={(isInProgress && !isAssignedToMe) ? 'completed' : (isPending ? 'pending' : s.status)} />
                    </h6>
                    <p className="small mb-0 mechanic-text-secondary">{v ? `${v.year} ${v.make} ${v.model}` : '—'}</p>
                  </div>

                </div>

                {isInProgress && isAssignedToMe && (
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
                        {s.notes?.some(n => n.text?.startsWith('[Manager Instruction]')) && (
                          <div className="mb-3 p-2 p-md-3 rounded" style={{ background: 'rgba(78,79,235,0.10)', border: '1px solid rgba(78,79,235,0.4)' }}>
                            <p className="small fw-bold text-uppercase mb-2" style={{ fontSize: 'min(0.65rem, 3vw)', color: 'var(--accent-primary)' }}>?? Manager Instructions</p>
                            {s.notes.filter(n => n.text?.startsWith('[Manager Instruction]')).map((n, i) => (
                              <p key={i} className="small mb-0" style={{ color: 'var(--text-primary)' }}>
                                {n.text.replace('[Manager Instruction] ', '')}
                              </p>
                            ))}
                          </div>
                        )}
                        {(s.logs?.length > 0 || s.pendingNotes?.length > 0) && (
                          <div className="mb-3 p-2 p-md-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                            <p className="small fw-bold text-uppercase mb-2 text-muted" style={{ fontSize: 'min(0.65rem, 3vw)' }}>Job History</p>
                            {renderNotesList(s)}
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

                {isReviewPending && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="spinner-grow spinner-grow-sm text-info" role="status"></div>
                      <span className="small fw-bold text-info text-uppercase">Waiting for Manager Review</span>
                    </div>
                    <button
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedLog(expandedLog === s._id ? null : s._id)}
                    >
                      {expandedLog === s._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedLog === s._id ? 'Hide Job Log' : 'View Job Log'}
                    </button>

                    {expandedLog === s._id && (
                      <div className="mechanic-notes-wrapper p-3 mt-3">
                        <p className="small fw-bold text-uppercase mb-3 text-muted" style={{ fontSize: '0.65rem' }}>Current Progress Log</p>
                        {(s.logs?.length > 0 || s.pendingNotes?.length > 0) ? renderNotesList(s) : (
                          <p className="small text-muted mb-0">No notes were captured for this job.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isInProgress && !isAssignedToMe && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <AlertCircle size={14} className="text-muted" />
                      <span className="small text-muted-custom">Currently handled by another technician</span>
                    </div>
                    <button
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedLog(expandedLog === s._id ? null : s._id)}
                    >
                      {expandedLog === s._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {expandedLog === s._id ? 'View Job Log' : 'View Job Log'}
                    </button>

                    {expandedLog === s._id && (
                      <div className="mechanic-notes-wrapper p-3 mt-3">
                        <p className="small fw-bold text-uppercase mb-3 text-muted" style={{ fontSize: '0.65rem' }}>Collaborative Log</p>
                        {(s.logs?.length > 0 || s.pendingNotes?.length > 0) ? renderNotesList(s) : (
                          <p className="small text-muted mb-0">No notes yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isPending && isAssignedToMe && (
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

                {isPending && !isAssignedToMe && (
                  <div className="d-flex justify-content-end border-top border-opacity-10 pt-3 mt-2">
                    <span className="small text-muted-custom">Assigned to another technician</span>
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
                        {(s.logs?.length > 0 || s.pendingNotes?.length > 0) ? renderNotesList(s) : (
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
                  {(s.logs?.length > 0 || s.pendingNotes?.length > 0) && (
                    <div className="p-3 mb-4 mechanic-notes-wrapper">
                      <p className="small fw-bold text-uppercase mb-3 mechanic-table-header">Current Job History</p>
                      {renderNotesList(s)}
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
    '/dashboard': { title: 'Mechanic Dashboard', description: 'Manage your assigned jobs and track progress.', render: renderDashboard },
    '/assigned-jobs': { title: 'Assigned Jobs', description: 'Review every assigned request in your queue.', render: renderAssignedJobs },
    '/updates': { title: 'Status Updates', description: 'Move jobs forward. Log major milestones and upload required photos.', render: renderUpdates },
    '/notes': { title: 'Technical Notes', description: 'Capture detailed diagnostics and attach them to your active jobs.', render: renderNotes },
  };

  const page = routeMap[pathname] || routeMap['/dashboard'];

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
