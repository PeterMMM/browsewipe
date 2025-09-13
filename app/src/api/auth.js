import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/app-login`, { email, password });
  return response.data;
};
