import React, { forwardRef } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = forwardRef(
  ({ className = '', activeClassName = '', pendingClassName = '', to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        // React Router provides isActive and isPending automatically
        className={({ isActive, isPending }) => {
          // Build the class string using standard JavaScript logic instead of the 'cn' utility
          let finalClassName = className;
          
          if (isActive && activeClassName) {
            finalClassName += ` ${activeClassName}`;
          }
          
          if (isPending && pendingClassName) {
            finalClassName += ` ${pendingClassName}`;
          }
          
          return finalClassName.trim();
        }}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };