
import { createContext, useContext, useState } from 'react';
import { loginAdmin } from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function login(credentials) {
    setAuthLoading(true);

    try {
      const response = await loginAdmin(credentials);

      const loggedInUser = {
        name: response.name,
        email: response.email,
      };

      localStorage.setItem('token', response.token);
      setUser(loggedInUser);

      return loggedInUser;
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    authLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
