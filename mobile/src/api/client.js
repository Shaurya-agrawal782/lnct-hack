import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = axios.create({
  baseURL: 'https://disasterconnect-87so.onrender.com/api',
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
