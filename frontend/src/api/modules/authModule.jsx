import axios from "axios";
import api from "../endpoints";
const apiUrl = import.meta.env.VITE_API_URL;

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}${api.adminLogin}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
