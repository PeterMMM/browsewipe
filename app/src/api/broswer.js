import axios from "axios";

const API_URL = "http://192.168.43.147:5001/api";

export const getBrowsers = async (token) => {
    try {
        const url = `${API_URL}/browsers`;
        console.log("Attempting to fetch browsers from:", url);

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        console.error("Failed to fetch browsers:", err);
        throw err;
    }
};

export const toggleEmergency = async (id, token) => {
  const url = `${API_URL}/browsers/${id}/emergency`;
  const response = await axios.post(
    url,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
