import React, { createContext, useContext, useState } from 'react';
// Corrected the import path to standard relative path and removed TypeScript imports
import { mockUsers } from '../data/mockData';

// Create the context with default empty values
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Custom hook to use the Auth context easily
export const useAuth = () => useContext(AuthContext);

// The Provider component that wraps your App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simple mock login: finds the first user in mockData with the matching role
  const login = (role) => {
    const found = mockUsers.find((u) => u.role === role);
    if (found) {
      setUser(found);
    } else {
      console.error(`No mock user found for role: ${role}`);
    }
  };

  // Simple logout: clears the user state
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};