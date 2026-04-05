import React, { createContext, useContext, useState } from 'react';

import { mockUsers } from '../data/mockData';


const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});


export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
  const login = (role) => {
    const found = mockUsers.find((u) => u.role === role);
    if (found) {
      setUser(found);
    } else {
      console.error(`No mock user found for role: ${role}`);
    }
  };

  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};