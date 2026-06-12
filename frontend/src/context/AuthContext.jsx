import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh current user profile
  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      if (res && res.data && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run initialization check on load
  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res && res.data && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role, phone) => {
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role, phone });
      if (res && res.data && res.data.user) {
        // Since register doesn't automatically log the user in via cookie in this design,
        // we can either return or attempt an automatic login. Let's return the user.
        return res.data.user;
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
