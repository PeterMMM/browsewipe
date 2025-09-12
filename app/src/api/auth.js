import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/app-login`, { email, password });
  console.log("response(login) -"+JSON.stringify(response));
  return response.data;
};
