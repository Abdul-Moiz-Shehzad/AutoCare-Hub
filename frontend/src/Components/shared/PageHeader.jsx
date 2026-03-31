import React from 'react';
import { Link } from 'react-router-dom';
import '../../Styles/Components.css';


export const PageHeader = ({ title, description, breadcrumbs, action }) => {
  return (
    <div className="mb-4">
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb small mb-1 page-header-breadcrumb">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <li 
                  key={i} 
                  className={`breadcrumb-item ${isLast ? 'active fw-medium page-header-crumb-active' : 'page-header-crumb-inactive'}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.href && !isLast ? (
                    <Link to={crumb.href} className="text-decoration-none page-header-link">
                      {crumb.label}
                    </Link>
                  ) : (
                    crumb.label
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Header Title and Action Area */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="flex-grow-1">
          <h1 className="h3 fw-bold mb-0 page-header-title">{title}</h1>
          {description && (
            <p className="mt-1 mb-0 small page-header-desc">{description}</p>
          )}
        </div>
        
        {/* Action Button Container */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;