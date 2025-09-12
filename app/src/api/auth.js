import axios from "axios";

const API_URL = "http://192.168.43.147:5001/api";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/app-login`, { email, password });
  console.log("response(login) -"+JSON.stringify(response));
  return response.data;
};
