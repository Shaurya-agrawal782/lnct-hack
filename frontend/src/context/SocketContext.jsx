import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    // 1. Only connect when user is authenticated
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // 2. Parse base server origin from VITE_API_URL (strip /api or /api/)
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketOrigin = apiURL.replace(/\/api\/?$/, '');

    // 3. Establish Socket.io connection with credentials enabled
    const socketInstance = io(socketOrigin, {
      withCredentials: true,
      autoConnect: true
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      console.log('Socket.io: Connected to server room');
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      console.log('Socket.io: Disconnected from server room');
    });

    // 4. Listen for real-time alert logs
    socketInstance.on('alert:new', (newAlert) => {
      setLiveAlerts(prev => [newAlert, ...prev]);
    });

    setSocket(socketInstance);

    // Cleanup on unmount or authentication state shift
    return () => {
      socketInstance.disconnect();
      setConnected(false);
    };
  }, [isAuthenticated, user]);

  const clearLiveAlerts = () => {
    setLiveAlerts([]);
  };

  return (
    <SocketContext.Provider value={{ socket, connected, liveAlerts, clearLiveAlerts }}>
      {children}
    </SocketContext.Provider>
  );
}
