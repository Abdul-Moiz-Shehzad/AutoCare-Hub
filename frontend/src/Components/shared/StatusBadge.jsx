import React from 'react';

import '../../Styles/Components.css';


const statusStyles = {
  'pending': 'status-badge-pending',
  'received': 'status-badge-received',
  'diagnosed': 'status-badge-diagnosed',
  'in-progress': 'status-badge-in-progress',
  'completed': 'status-badge-completed',
  'cancelled': 'status-badge-cancelled',
  'low': 'status-badge-low',
  'medium': 'status-badge-medium',
  'high': 'status-badge-high',
  'urgent': 'status-badge-urgent',
};

const defaultStyle = 'status-badge-default';

export default function StatusBadge({ status, className = '' }) {
  const styleClass = statusStyles[status] || defaultStyle;

  return (
    <span 
      className={`badge rounded-pill fw-medium text-capitalize px-2 py-1 status-badge-base ${styleClass} ${className}`}
    >
      {status ? status.replace('-', ' ') : 'Unknown'}
    </span>
  );
};