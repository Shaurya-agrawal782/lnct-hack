import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/authApi';

export const AuthContext = createContext();

const TOKEN_KEY = 'disasterconnect_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Default to false so we don't block the UI on startup

  // Restore session in the background
  const restoreSession = useCallback(async () => {
    console.log('[AuthContext] Starting background restoreSession...');
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('[AuthContext] Stored token found:', storedToken ? 'Yes' : 'No');
      if (storedToken) {
        setToken(storedToken);
        console.log('[AuthContext] Verifying token in background...');
        const res = await authApi.me();
        if (res && res.data && res.data.user) {
          console.log('[AuthContext] Token verified. Setting user:', res.data.user.email);
          setUser(res.data.user);
        } else {
          console.log('[AuthContext] Token verification failed. Clearing storage.');
          await AsyncStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.warn('[AuthContext] Error during background session restore:', error);
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
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
