import axios from 'axios';

const API_BASE_URL = 'http://your-api-base-url';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
  } catch (error:any) {
    throw error.response?.data || error.message;
  }
};

export const register = async (user: { username: string; password: string; email: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, user);
    return response.data;
  } catch (error:any) {
    throw error.response?.data || error.message;
  }
};