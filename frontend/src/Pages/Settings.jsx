import React, { useState } from 'react';
import DashboardLayout from '../Components/layout/DashboardLayout';
import PageHeader from '../Components/shared/PageHeader';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, Phone, Trash2, Save, AlertCircle, CheckCircle2, 
  LayoutDashboard, Briefcase, RefreshCw, FileText, Settings as SettingsIcon,
  Car, History, Activity, Star, CalendarPlus
} from 'lucide-react';
import '../Styles/Pages.css';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [phoneData, setPhoneData] = useState({ currentPassword: '', newPhone: user.phone || '' });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Menu items based on role
  const getMenuItems = () => {
    switch (user.role) {
      case 'manager':
        return [
          { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { title: 'Service Requests', url: '/requests', icon: <Briefcase size={18} /> },
          { title: 'Mechanics', url: '/mechanics', icon: <User size={18} /> },
        ];
      case 'mechanic':
        return [
          { title: 'Dashboard', url: '/dashboard', icon: <LayoutDashboard size={18} /> },
          { title: 'Assigned Jobs', url: '/assigned-jobs', icon: <Briefcase size={18} /> },
          { title: 'Updates', url: '/updates', icon: <RefreshCw size={18} /> },
          { title: 'Notes', url: '/notes', icon: <FileText size={18} /> },
        ];
      case 'customer':
      default:
        return [
          { title: 'Garage', url: '/vehicles', icon: <Car size={18} /> },
          { title: 'History', url: '/history', icon: <History size={18} /> },
          { title: 'Tracking', url: '/service-tracking', icon: <Activity size={18} /> },
          { title: 'Book Service', url: '/book-service', icon: <CalendarPlus size={18} /> },
        ];
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/change-phone', phoneData);
      setMessage({ type: 'success', text: 'Phone number updated successfully' });
      // Update local storage
      const updatedUser = { ...user, phone: data.phone };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update phone number' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you ABSOLUTELY sure? This action cannot be undone and will delete all your data.")) {
      return;
    }
    setLoading(true);
    try {
      await api.delete('/auth/delete-account');
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={getMenuItems()} sectionLabel="Account">
      <PageHeader 
        title="Account Settings" 
        description="Manage your profile, security, and account preferences."
        breadcrumbs={[{ label: 'Settings' }]}
      />

      <div className="container-fluid px-0 mt-4">
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 mb-4 border-0 shadow-sm`} style={{ borderRadius: 'var(--radius)' }}>
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="row g-4">
          {/* Security Section */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Lock size={20} className="text-primary" /> Change Password
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      required 
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      required 
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      required 
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4" disabled={loading}>
                    <Save size={18} /> Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Phone size={20} className="text-primary" /> Phone Number
                </h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handlePhoneChange}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">New Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      required 
                      value={phoneData.newPhone}
                      onChange={e => setPhoneData({...phoneData, newPhone: e.target.value})}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Confirm with Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      required 
                      value={phoneData.currentPassword}
                      onChange={e => setPhoneData({...phoneData, currentPassword: e.target.value})}
                      placeholder="Enter password to save changes"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-2 px-4" disabled={loading}>
                    <Save size={18} /> Update Phone
                  </button>
                </form>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-0 shadow-sm border-start border-danger border-4">
              <div className="card-header bg-transparent border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2">
                  <Trash2 size={20} /> Danger Zone
                </h5>
              </div>
              <div className="card-body p-4">
                <p className="text-muted small mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                  {user.role === 'manager' && " Since you are a Manager, all your mechanics will also be deleted."}
                  {user.role === 'mechanic' && " Mechanics cannot delete their own accounts. Please contact your manager."}
                </p>
                <button 
                  className="btn btn-outline-danger d-flex align-items-center gap-2" 
                  disabled={loading || user.role === 'mechanic'}
                  onClick={handleDeleteAccount}
                >
                  <Trash2 size={18} /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
