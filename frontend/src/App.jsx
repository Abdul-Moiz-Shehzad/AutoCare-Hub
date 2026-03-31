import React from 'react';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Import Pages using standard relative paths and correct capitalization
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CustomerDashboard from "./Pages/customer/Dashboard";
import Vehicles from "./Pages/customer/Vehicles";
import BookService from "./Pages/customer/BookService";
import ServiceTracking from "./Pages/customer/ServiceTracking";
import ServiceHistory from "./Pages/customer/ServiceHistory";
import MechanicDashboard from "./Pages/mechanic/Dashboard";
import ManagerDashboard from "./Pages/manager/Dashboard";
import NotFound from "./Pages/NotFound";

import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/vehicles" element={<Vehicles />} />
          <Route path="/customer/book-service" element={<BookService />} />
          <Route path="/customer/service-tracking" element={<ServiceTracking />} />
          <Route path="/customer/history" element={<ServiceHistory />} />
          
          {/* Mechanic Routes */}
          <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
          <Route path="/mechanic/assigned-jobs" element={<MechanicDashboard />} />
          <Route path="/mechanic/updates" element={<MechanicDashboard />} />
          <Route path="/mechanic/notes" element={<MechanicDashboard />} />
          
          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/requests" element={<ManagerDashboard />} />
          <Route path="/manager/mechanics" element={<ManagerDashboard />} />
          <Route path="/manager/assignments" element={<ManagerDashboard />} />
          <Route path="/manager/workflow" element={<ManagerDashboard />} />
          
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;