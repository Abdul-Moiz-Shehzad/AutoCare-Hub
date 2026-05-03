import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CustomerDashboard from "./Pages/customer/Dashboard";
import Vehicles from "./Pages/customer/Vehicles";
import BookService from "./Pages/customer/BookService";
import ServiceTracking from "./Pages/customer/ServiceTracking";
import ServiceHistory from "./Pages/customer/ServiceHistory";
import Settings from './Pages/Settings';
import MechanicDashboard from "./Pages/mechanic/Dashboard";
import ManagerDashboard from "./Pages/manager/Dashboard";
import NotFound from "./Pages/NotFound";

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Dashboard Switcher
const DashboardSwitcher = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  
  if (userInfo?.role === 'manager') return <ManagerDashboard />;
  if (userInfo?.role === 'mechanic') return <MechanicDashboard />;
  return <CustomerDashboard />;
};

export default function App() {
  return (
      <div className="app-container">
        <Routes>
          {}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardSwitcher /></ProtectedRoute>} />
          
          {}
          <Route path="/vehicles" element={<ProtectedRoute allowedRoles={['customer']}><Vehicles /></ProtectedRoute>} />
          <Route path="/book-service" element={<ProtectedRoute allowedRoles={['customer']}><BookService /></ProtectedRoute>} />
          <Route path="/service-tracking" element={<ProtectedRoute allowedRoles={['customer']}><ServiceTracking /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute allowedRoles={['customer']}><ServiceHistory /></ProtectedRoute>} />
          
          {}
          <Route path="/assigned-jobs" element={<ProtectedRoute allowedRoles={['mechanic']}><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/updates" element={<ProtectedRoute allowedRoles={['mechanic']}><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute allowedRoles={['mechanic']}><MechanicDashboard /></ProtectedRoute>} />
          
          {}
          <Route path="/requests" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/mechanics" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/workflow" element={<ProtectedRoute allowedRoles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
          
          {}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  );
};