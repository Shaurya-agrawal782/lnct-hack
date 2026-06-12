import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../api/authApi';

export const AuthContext = createContext();

// sessionStorage key — keep consistent across the app
const TOKEN_KEY = 'disasterconnect_token';

// Helper: pause execution for `ms` milliseconds
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Token helpers ---
const saveToken = (token) => {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
};
const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);
const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh user profile (used after actions that don't change token)
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

  /**
   * On initial mount, attempt to restore session with retries.
   *
   * This handles two separate deployment problems:
   * 1. Render free-tier cold starts: backend takes 20-30s to wake up;
   *    network errors should be retried rather than silently logging out.
   * 2. Cross-origin cookie blocking: if a sessionStorage token exists,
   *    the axios interceptor will send it as Bearer so /auth/me succeeds
   *    even when the browser blocks the HttpOnly cookie.
   */
  const initSessionWithRetry = async (maxAttempts = 3, delayMs = 2000) => {
    setLoading(true);
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await getCurrentUser();
        if (res && res.data && res.data.user) {
          setUser(res.data.user);
          setLoading(false);
          return;
        }
        // API responded but no user — not a cold-start, stop retrying
        setUser(null);
        setLoading(false);
        return;
      } catch (error) {
        const isNetworkError = !error.response;
        const is401 = error.response?.status === 401;

        if (is401) {
          // 401 = cookie missing/invalid AND bearer also rejected (or not present)
          // Clear any stale token and mark as logged out
          clearToken();
          setUser(null);
          setLoading(false);
          return;
        }

        if (isNetworkError && attempt < maxAttempts) {
          // Backend may be cold-starting — wait and retry
          await sleep(delayMs);
          continue;
        }

        // Any other error or last network retry — give up
        setUser(null);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  // Run initialization check on load
  useEffect(() => {
    initSessionWithRetry();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res && res.data && res.data.user) {
        setUser(res.data.user);
        // Store token for Bearer fallback in cross-origin deployments
        if (res.data.token) {
          saveToken(res.data.token);
        }
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
      // Swallow — still clear local state regardless
    } finally {
      // Always clear the fallback token and user state
      clearToken();
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
