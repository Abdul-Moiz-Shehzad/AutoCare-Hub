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
  CheckCircle2, Play, Camera, Trash2, Image as ImageIcon, Save,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/mechanic/dashboard', icon: <LayoutDashboard size={18} /> },
  { title: 'Assigned Jobs', url: '/mechanic/assigned-jobs', icon: <Briefcase size={18} /> },
  { title: 'Updates', url: '/mechanic/updates', icon: <RefreshCw size={18} /> },
  { title: 'Notes', url: '/mechanic/notes', icon: <FileText size={18} /> },
];

const MechanicDashboard = () => {
  const { pathname } = useLocation();

  // Initialize and normalize legacy mock data into hierarchical objects
  const [services, setServices] = useState(() => 
    mockServices.filter(s => s.mechanicId === 'u2').map(s => ({
      ...s,
      notes: s.notes.map((n, i) => typeof n === 'string' ? { id: `legacy-${i}`, milestone: n, technicalNotes: [] } : n)
    }))
  );

  // Split input states for Updates (Milestones) vs Notes (Technical)
  const [milestoneInputs, setMilestoneInputs] = useState({});
  const [techInputs, setTechInputs] = useState({});
  const [pictureAttached, setPictureAttached] = useState({});
  
  const [expandedLog, setExpandedLog] = useState(null); 
  const [expandedWorkspace, setExpandedWorkspace] = useState({}); 

  // Derived states
  const activeJobs = services.filter(s => !['completed', 'cancelled'].includes(s.status));
  const inProgress = services.filter(s => s.status === 'in-progress');
  const completedToday = services.filter(s => s.status === 'completed');
  const pendingJobs = services.filter(s => s.status !== 'in-progress' && s.status !== 'completed' && s.status !== 'cancelled');

  // Core update functions
  const updateStatus = (id, status) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const deleteJob = (id) => {
    if(window.confirm("Are you sure you want to delete this completed record?")) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleFileUpload = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      setPictureAttached(prev => ({ ...prev, [id]: e.target.files[0].name }));
    }
  };

  // --- HIERARCHICAL NOTE LOGIC ---

  // 1. Adds a Parent Milestone (from Updates Tab)
  const addMilestone = (id, text) => {
    setServices(prev => prev.map(s => s.id === id ? { 
      ...s, 
      notes: [...s.notes, { id: Date.now().toString(), milestone: text, technicalNotes: [] }] 
    } : s));
  };

  // 2. Adds a Child Technical Note to the LATEST Milestone (from Notes Tab)
  const addTechnicalNote = (id, text) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const newNotes = [...s.notes];
        // If they add a tech note before logging any milestones, create a default bucket
        if (newNotes.length === 0) {
          newNotes.push({ id: Date.now().toString(), milestone: 'Initial Workspace Setup', technicalNotes: [text] });
        } else {
          // Attach to the most recent milestone
          const lastIdx = newNotes.length - 1;
          newNotes[lastIdx] = { ...newNotes[lastIdx], technicalNotes: [...newNotes[lastIdx].technicalNotes, text] };
        }
        return { ...s, notes: newNotes };
      }
      return s;
    }));
  };

  // --- TAB ACTION HANDLERS ---

  const handleMilestoneUpdate = (id) => {
    const note = milestoneInputs[id]?.trim();
    if (!note) {
      alert("Please write a note to log a milestone update.");
      return;
    }
    addMilestone(id, note);
    setMilestoneInputs(prev => ({ ...prev, [id]: '' }));
    setPictureAttached(prev => ({ ...prev, [id]: null })); 
    alert("Milestone logged! Job remains In Progress.");
  };

  const handleTechUpdate = (id) => {
    const note = techInputs[id]?.trim();
    if (!note) return;
    addTechnicalNote(id, note);
    setTechInputs(prev => ({ ...prev, [id]: '' }));
    alert("Technical note attached to current milestone.");
  };

  const handleValidatedUpdate = (id, targetStatus) => {
    // ENFORCEMENT: Block starting work if another job is already in progress
    if (targetStatus === 'in-progress') {
      const currentlyActiveJob = services.find(s => s.status === 'in-progress');
      if (currentlyActiveJob && currentlyActiveJob.id !== id) {
        alert(`You are currently working on "${currentlyActiveJob.serviceType}". Please complete it before starting a new job.`);
        return;
      }
    }

    const note = milestoneInputs[id]?.trim();
    const hasPicture = pictureAttached[id];

    if (targetStatus === 'completed' && (!note || !hasPicture)) {
      alert("COMPULSORY: You must write a final milestone note AND attach a picture of the work to complete this job.");
      return;
    }

    if (note) {
      addMilestone(id, note);
      setMilestoneInputs(prev => ({ ...prev, [id]: '' }));
    }
    
    updateStatus(id, targetStatus);
    
    if (targetStatus === 'in-progress') {
      setExpandedWorkspace(prev => ({ ...prev, [id]: true }));
    }

    if (targetStatus === 'completed') {
      alert('Job successfully marked as Completed!');
      setExpandedWorkspace(prev => ({ ...prev, [id]: false }));
    }
  };

  // Helper function to render the hierarchy UI cleanly
  const renderNotesHierarchy = (notes) => (
    <ul className="mb-0 small ps-1 mechanic-text-secondary list-unstyled">
      {notes.map((n) => (
        <li key={n.id} className="mb-3">
          {/* Main Milestone Heading */}
          <div className="fw-bold mechanic-text-primary d-flex align-items-center gap-2">
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
            {n.milestone}
          </div>
          {/* Nested Technical Children */}
          {n.technicalNotes && n.technicalNotes.length > 0 && (
            <ul className="mt-2 ps-4 text-muted" style={{ listStyleType: 'circle' }}>
              {n.technicalNotes.map((tn, i) => (
                <li key={i} className="mb-1 pb-1 border-bottom border-opacity-10" style={{ borderColor: 'var(--border-subtle)' }}>{tn}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  // View 1: Main Dashboard
  const renderDashboard = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Assigned Jobs" value={activeJobs.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedToday.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>

      <div className="mt-4">
        <h5 className="fw-bold mb-3 mechanic-text-primary">Assigned Jobs</h5>
        <div className="d-flex flex-column gap-3">
          {activeJobs.map(s => {
            const v = mockVehicles.find(v => v.id === s.vehicleId);
            const isPending = s.status !== 'in-progress' && s.status !== 'completed';
            
            return (
              <div key={s.id} className="card border-0">
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-between gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="fw-bold mb-0 mechanic-text-primary">{s.serviceType}</h5>
                        <StatusBadge status={isPending ? 'pending' : s.status} />
                        <StatusBadge status={s.priority} />
                      </div>
                      <p className="small mb-1 mechanic-text-secondary">
                        {v ? `${v.year} ${v.make} ${v.model} · ${v.plate}` : '—'}
                      </p>
                      <p className="small mb-0 mechanic-text-muted">{s.description}</p>
                    </div>
                    <div className="d-flex gap-2 mt-2 mt-sm-0">
                      {isPending && <button className="btn btn-sm btn-warning d-flex align-items-center gap-1" onClick={() => handleValidatedUpdate(s.id, 'in-progress')} style={{ color: '#0f0e17' }}><Play size={14} /> Start Work</button>}
                      {s.status === 'in-progress' && <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => handleValidatedUpdate(s.id, 'completed')}><CheckCircle2 size={14} /> Complete</button>}
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
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Finished" value={completedToday.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
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
                const isPending = s.status !== 'in-progress' && s.status !== 'completed';
                return (
                  <tr key={s.id}>
                    <td className="ps-4 fw-medium mechanic-text-primary">{s.serviceType}</td>
                    <td className="mechanic-text-secondary">{vehicle ? `${vehicle.make} ${vehicle.model}` : '—'}</td>
                    <td><StatusBadge status={s.priority} /></td>
                    <td><StatusBadge status={isPending ? 'pending' : s.status} /></td>
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
        <div className="col-sm-6 col-lg-4"><StatCard title="Pending" value={pendingJobs.length} icon={<Briefcase size={24} />} color="danger" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="In Progress" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed" value={completedToday.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      <div className="d-flex flex-column gap-4 mt-4">
        {services.map(s => {
          const v = mockVehicles.find(v => v.id === s.vehicleId);
          const isCompleted = s.status === 'completed';
          const isInProgress = s.status === 'in-progress';
          const isPending = !isCompleted && !isInProgress;

          return (
            <div key={s.id} className="card border-0">
              <div className="card-body p-4">
                
                {/* Header Information */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold mb-1 mechanic-text-primary d-flex align-items-center gap-2">
                      {s.serviceType}
                      <StatusBadge status={isPending ? 'pending' : s.status} />
                    </h6>
                    <p className="small mb-0 mechanic-text-secondary">{v ? `${v.year} ${v.make} ${v.model}` : '—'}</p>
                  </div>
                  
                  {isCompleted && (
                    <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => deleteJob(s.id)}>
                      <Trash2 size={14} /> Delete Record
                    </button>
                  )}
                </div>

                {/* --- IN PROGRESS: Minimizable Workspace --- */}
                {isInProgress && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <button 
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedWorkspace(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                    >
                      {expandedWorkspace[s.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
                      {expandedWorkspace[s.id] ? 'Hide Workspace' : 'Update Job Progress'}
                    </button>

                    {expandedWorkspace[s.id] && (
                      <div className="mechanic-notes-wrapper p-3 mt-3">
                        
                        {/* Hierarchical History Viewer */}
                        {s.notes.length > 0 && (
                          <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                            <p className="small fw-bold text-uppercase mb-3 text-muted" style={{fontSize: '0.65rem'}}>Job History & Milestones</p>
                            {renderNotesHierarchy(s.notes)}
                          </div>
                        )}

                        <label className="small fw-bold text-uppercase mb-2 mechanic-table-header w-100 px-0">Log New Milestone</label>
                        <textarea
                          className="form-control form-control-sm mb-3"
                          placeholder="What did you just complete? (e.g., 'Removed old transmission', 'Installed new pads')..."
                          value={milestoneInputs[s.id] || ''}
                          onChange={e => setMilestoneInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                          rows={3}
                        ></textarea>

                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                          
                          <div className="d-flex align-items-center gap-2">
                            <input 
                              type="file" 
                              id={`file-${s.id}`} 
                              className="d-none" 
                              accept="image/*"
                              onChange={(e) => handleFileUpload(s.id, e)} 
                            />
                            <label htmlFor={`file-${s.id}`} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 m-0 cursor-pointer">
                              <Camera size={14} /> 
                              {pictureAttached[s.id] ? 'Change Photo' : 'Attach Photo'}
                            </label>
                            
                            {pictureAttached[s.id] && (
                              <span className="small text-success d-flex align-items-center gap-1 fw-medium">
                                <ImageIcon size={14} /> Attached
                              </span>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => handleMilestoneUpdate(s.id)}>
                              <Save size={14} /> Log Milestone
                            </button>
                            <button className="btn btn-sm btn-success d-flex align-items-center gap-1" onClick={() => handleValidatedUpdate(s.id, 'completed')}>
                              <CheckCircle2 size={14} /> Complete Job
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Progression Button */}
                {isPending && (
                  <div className="d-flex justify-content-end border-top border-opacity-10 pt-3 mt-2">
                    <button 
                      className="btn btn-sm btn-warning d-flex align-items-center gap-1" 
                      onClick={() => handleValidatedUpdate(s.id, 'in-progress')} 
                      style={{ color: '#0f0e17' }}
                    >
                      <Play size={14} /> Start Work
                    </button>
                  </div>
                )}

                {/* --- COMPLETED: Expandable Logs --- */}
                {isCompleted && (
                  <div className="mt-3 pt-3 border-top border-opacity-10">
                    <button 
                      className="btn btn-sm btn-link text-muted d-flex align-items-center gap-2 m-0 p-0 text-decoration-none"
                      onClick={() => setExpandedLog(expandedLog === s.id ? null : s.id)}
                    >
                      {expandedLog === s.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
                      {expandedLog === s.id ? 'Hide Job Log' : 'View Job Log'}
                    </button>
                    
                    {expandedLog === s.id && (
                      <div className="mechanic-notes-wrapper p-3 mt-3">
                        <p className="small fw-bold text-uppercase mb-3 text-muted" style={{fontSize: '0.65rem'}}>Completion Log</p>
                        
                        {s.notes.length > 0 ? (
                          renderNotesHierarchy(s.notes)
                        ) : (
                          <p className="small text-muted mb-3 italic">No notes were captured for this job.</p>
                        )}

                        <p className="small fw-bold text-uppercase mb-2 text-muted mt-4" style={{fontSize: '0.65rem'}}>Final Work Photo</p>
                        {s.finalImage ? (
                          <div className="d-flex flex-column align-items-start gap-2">
                            <img 
                              src={s.finalImage} 
                              alt="Completed work" 
                              className="img-fluid rounded border border-color"
                              style={{ maxHeight: '200px', width: 'auto' }}
                            />
                          </div>
                        ) : (
                          <p className="small text-muted italic">No final photo was attached for this job.</p>
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

  // View 4: Notes (Technical Details Attached to Milestones)
  const renderNotes = () => (
    <>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-4"><StatCard title="Active Services" value={inProgress.length} icon={<Play size={24} />} color="warning" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Total Assigned" value={services.length} icon={<Briefcase size={24} />} color="accent" /></div>
        <div className="col-sm-6 col-lg-4"><StatCard title="Completed Today" value={completedToday.length} icon={<CheckCircle2 size={24} />} color="success" /></div>
      </div>
      
      <div className="d-flex flex-column gap-3 mt-4">
        {inProgress.length > 0 ? (
          inProgress.map(s => {
            const v = mockVehicles.find(v => v.id === s.vehicleId);
            return (
              <div key={s.id} className="card border-0">
                <div className="card-header fw-bold py-3 mechanic-text-primary d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    {s.serviceType}
                    <StatusBadge status={s.status} />
                  </div>
                  <span className="small text-muted">{v ? `${v.make} ${v.model}` : ''}</span>
                </div>
                <div className="card-body p-4">
                  
                  {/* Current Hierarchical Log Viewer */}
                  {s.notes.length > 0 && (
                    <div className="p-3 mb-4 mechanic-notes-wrapper">
                      <p className="small fw-bold text-uppercase mb-3 mechanic-table-header">Current Job History</p>
                      {renderNotesHierarchy(s.notes)}
                    </div>
                  )}

                  <div className="d-flex flex-column gap-3 mt-3">
                    <label className="small fw-bold text-uppercase mechanic-table-header px-0 mb-0">Add Technical Detail</label>
                    <p className="small text-muted mb-0">This will be attached to your most recent milestone.</p>
                    <textarea
                      className="form-control"
                      placeholder="e.g., Found metal shavings in oil pan, recommended customer change filter brand..."
                      value={techInputs[s.id] || ''}
                      onChange={e => setTechInputs(prev => ({ ...prev, [s.id]: e.target.value }))}
                      rows={3}
                    ></textarea>
                    <div className="d-flex justify-content-end mt-1">
                      <button className="btn btn-primary btn-sm px-4 d-flex align-items-center gap-2" onClick={() => handleTechUpdate(s.id)}>
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
    '/mechanic/notes': { title: 'Technical Notes', description: 'Capture detailed diagnostics and attach them to your active milestones.', render: renderNotes },
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