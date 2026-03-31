import React from 'react';

import '../../Styles/Components.css';

// Map the custom color names to theme-consistent styles
const colorMap = {
  accent: 'icon-style-accent',
  success: 'icon-style-success',
  warning: 'icon-style-warning',
  danger: 'icon-style-danger',
  info: 'icon-style-info',
};

export const StatCard = ({ title, value, icon, trend, color = 'accent' }) => {
  const colorClass = colorMap[color] || colorMap.accent;
  
  return (
    <div className="card border-0 h-100 stat-card">
      <div className="card-body d-flex align-items-center gap-3 p-4">
        
        {/* Icon Container */}
        <div 
          className={`d-flex align-items-center justify-content-center stat-card-icon-container ${colorClass}`}
        >
          {icon}
        </div>
        
        {/* Text Content */}
        <div>
          <p className="small fw-semibold text-uppercase mb-1 stat-card-title">{title}</p>
          <h3 className="fw-bold mb-0 stat-card-value">{value}</h3>
          {trend && <p className="small mb-0 mt-1 stat-card-trend">{trend}</p>}
        </div>
        
      </div>
    </div>
  );
};

export default StatCard;