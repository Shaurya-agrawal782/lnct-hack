import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/authApi';

export const AuthContext = createContext();

const TOKEN_KEY = 'disasterconnect_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
        const res = await authApi.me();
        if (res && res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          // Token is invalid or expired
          await AsyncStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.warn('Error restoring session:', error);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res && res.data && res.data.user) {
        const userObj = res.data.user;
        const tokenStr = res.data.token || null;
        
        setUser(userObj);
        if (tokenStr) {
          setToken(tokenStr);
          await AsyncStorage.setItem(TOKEN_KEY, tokenStr);
        }
        return userObj;
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authApi.register(payload);
      if (res && res.data && res.data.user) {
        const userObj = res.data.user;
        const tokenStr = res.data.token || null;
        
        // Save session if register returns token
        if (tokenStr) {
          setUser(userObj);
          setToken(tokenStr);
          await AsyncStorage.setItem(TOKEN_KEY, tokenStr);
        }
        return userObj;
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
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API warning (clearing local session anyway):', error);
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        restoreSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
