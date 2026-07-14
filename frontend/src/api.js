import axios from 'axios';

const api = axios.create({
  // Use local backend for development if needed, otherwise use Render production url
  baseURL: import.meta.env.VITE_API_URL || 'https://samidhagbpec.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
