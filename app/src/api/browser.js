import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getBrowsers = async (token) => {
    try {
        const url = `${API_URL}/browsers`;

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
