import React, { forwardRef } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = forwardRef(
  ({ className = '', activeClassName = '', pendingClassName = '', to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) => {
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