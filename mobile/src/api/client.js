import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 127.0.0.1 for local development (works with adb reverse) or Render for production
const baseURL = __DEV__
  ? 'http://127.0.0.1:5000/api'
  : 'https://disasterconnect-87so.onrender.com/api';

const client = axios.create({
  baseURL,
  timeout: 8000, // 8 seconds timeout to prevent indefinite loading hangs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from AsyncStorage when available.
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('disasterconnect_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
