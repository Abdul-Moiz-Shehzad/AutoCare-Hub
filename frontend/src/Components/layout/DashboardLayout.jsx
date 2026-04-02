import React, { useState, useEffect } from 'react';
import '../../Styles/Dashboard.css';
import '../../Styles/Components.css';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Wrench, PanelLeftClose, PanelLeftOpen, User, LogOut, ChevronDown, X } from 'lucide-react';

// The Sidebar Component
const SidebarNav = ({ menuItems, sectionLabel, collapsed, mobileOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
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
        {/* Sidebar Header */}
        <div className="d-flex align-items-center gap-3 p-3 sidebar-header">
          <div className="sidebar-logo">
            <Wrench size={18} strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="d-flex flex-column justify-content-center flex-grow-1">
              <span className="fw-bold sidebar-title lh-1 mb-1" style={{ fontSize: '1rem', letterSpacing: '0.5px' }}>AUTOCARE</span>
              <span className="sidebar-section-label lh-1 m-0">PRECISION HUB</span>
            </div>
          )}
          {/* Mobile close button inside sidebar */}
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

        {/* Sidebar Menu */}
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

// The Main Layout Component
export const DashboardLayout = ({ children, menuItems, sectionLabel }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Track viewport size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // close overlay when resizing up
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
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
    <div className="d-flex min-vh-100 dashboard-layout-bg">

      {/* Left Sidebar */}
      <SidebarNav
        menuItems={menuItems}
        sectionLabel={sectionLabel}
        collapsed={isMobile ? false : collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Right Content Area */}
      <div className="d-flex flex-column flex-grow-1 w-100" style={{ minWidth: 0 }}>

        {/* Top Navbar */}
        <header className="d-flex align-items-center justify-content-between px-4 dashboard-header">

          {/* Toggle Button */}
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center dashboard-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle sidebar"
          >
            {collapsed && !isMobile ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* User Profile Dropdown */}
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

            <ul className="dropdown-menu dropdown-menu-end mt-2 dropdown-menu-custom">
              <li className="px-3 py-2 d-flex align-items-center gap-2">
                <User size={14} className="user-profile-icon" />
                <span className="small user-email-text">{user?.email || 'user@example.com'}</span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2 logout-btn-text" onClick={handleLogout}>
                  <LogOut size={14} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="p-4 flex-grow-1 overflow-auto dashboard-main-content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;