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
const ProtectedRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  if (!userInfo || !userInfo.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
          <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
          <Route path="/customer/book-service" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
          <Route path="/customer/service-tracking" element={<ProtectedRoute><ServiceTracking /></ProtectedRoute>} />
          <Route path="/customer/history" element={<ProtectedRoute><ServiceHistory /></ProtectedRoute>} />
          
          {}
          <Route path="/mechanic/dashboard" element={<ProtectedRoute><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/mechanic/assigned-jobs" element={<ProtectedRoute><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/mechanic/updates" element={<ProtectedRoute><MechanicDashboard /></ProtectedRoute>} />
          <Route path="/mechanic/notes" element={<ProtectedRoute><MechanicDashboard /></ProtectedRoute>} />
          
          {}
          <Route path="/manager/dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/requests" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/mechanics" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/assignments" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/manager/workflow" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          
          {}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  );
};