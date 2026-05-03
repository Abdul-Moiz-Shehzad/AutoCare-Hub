import React, { useState, useEffect } from 'react';
import '../../Styles/Dashboard.css';
import '../../Styles/Components.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../../store/authSlice';
import api from '../../lib/api';
import { Wrench, PanelLeftClose, PanelLeftOpen, User, LogOut, ChevronDown, X, Settings as SettingsIcon } from 'lucide-react';


const SidebarNav = ({ menuItems, sectionLabel, collapsed, mobileOpen, onClose }) => {
  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`d-flex flex-column sidebar-container sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}
        style={{
          minWidth: collapsed ? '80px' : '260px',
          width: collapsed ? '80px' : '260px',
        }}
      >
        <div className="d-flex align-items-center gap-3 p-3 sidebar-header">
          <div className="sidebar-logo">
            <Wrench size={18} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="d-flex flex-column justify-content-center flex-grow-1">
              <span className="fw-bold sidebar-title lh-1 mb-1 sidebar-brand-text">AUTOCARE</span>
              <span className="sidebar-section-label lh-1 m-0">PRECISION HUB</span>
            </div>
          )}
          {mobileOpen && (
            <button
              className="btn p-0 ms-auto d-flex align-items-center justify-content-center dashboard-toggle-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-3 flex-grow-1">
          {!collapsed && (
            <div className="text-uppercase small fw-bold mb-3 mt-2 sidebar-section-label">
              {sectionLabel}
            </div>
          )}
          <ul className="nav nav-pills flex-column mb-auto gap-1">
            {menuItems.map((item, index) => (
              <li className="nav-item" key={index}>
                <NavLink
                  to={item.url}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-3 px-3 py-2 sidebar-nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-nav-icon">
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};


export default function DashboardLayout({ children, menuItems, sectionLabel }) {
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); 
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className="d-flex vh-100 dashboard-layout-bg">

      <SidebarNav
        menuItems={menuItems}
        sectionLabel={sectionLabel}
        collapsed={isMobile ? false : collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="d-flex flex-column flex-grow-1 w-100 dashboard-main-wrapper">

        <header className="d-flex align-items-center justify-content-between px-4 dashboard-header">

          <button
            className="btn btn-sm d-flex align-items-center justify-content-center dashboard-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle sidebar"
          >
            {collapsed && !isMobile ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className="dropdown">
            <button
              className="btn d-flex align-items-center gap-2 px-3 py-1 user-profile-dropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="user-profile-avatar">
                {getInitials(user?.name)}
              </div>
              <span className="d-none d-sm-inline fw-medium user-profile-name">{user?.name || 'User Profile'}</span>
              <ChevronDown size={14} className="user-profile-icon" />
            </button>

            <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 p-2 dropdown-menu-custom">
              <div className="px-3 py-2 border-bottom border-opacity-10 mb-2">
                <p className="small fw-bold mb-0 text-primary">{user?.name}</p>
                <p className="small text-muted mb-0 dropdown-role-text">{user?.role?.toUpperCase()}</p>
              </div>
              
              <button className="dropdown-item d-flex align-items-center gap-2 py-2 rounded mb-1" onClick={() => navigate('/settings')}>
                <SettingsIcon size={16} />
                Settings
              </button>
              
              <button className="dropdown-item d-flex align-items-center gap-2 py-2 rounded text-danger" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 flex-grow-1 overflow-auto dashboard-main-content">
          {children}
        </main>

      </div>
    </div>
  );
};