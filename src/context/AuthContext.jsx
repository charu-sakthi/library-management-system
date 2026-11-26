import { createContext, useContext, useState } from 'react';
import { loginAdmin, logoutAdmin } from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function login(credentials) {
    setAuthLoading(true);
    try {
      const response = await loginAdmin(credentials);
      setUser(response.user);
      return response.user;
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    setAuthLoading(true);
    try {
      await logoutAdmin();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }
  return context;
}
