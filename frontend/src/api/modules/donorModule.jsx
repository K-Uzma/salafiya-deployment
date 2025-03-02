import axios from "../axios";
import api from "../endpoints";
const apiUrl = import.meta.env.VITE_API_URL;

export const AdminDetailByID = async () => {
  try {
    const response = await axios.get(`${apiUrl}${api.adminDetailByID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const InsertNewDonor = async (formData) => {
  try {
    const response = await axios.post(
      `${apiUrl}${api.insertNewDonor}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DonorsList = async () => {
  try {
    const response = await axios.get(`${apiUrl}${api.donorsList}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DonorDetailByID = async (id) => {
  try {
    const response = await axios.get(`${apiUrl}${api.donorDetailByID}${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
