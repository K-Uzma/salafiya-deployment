import axios from "axios";
import { toast } from "react-toastify";

let isToastShown = false; // Prevent duplicate toasts
const token = localStorage.getItem("sal_cam_token");
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Add an Axios interceptor to handle responses with status code 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!isToastShown) {
        isToastShown = true; // Ensure only one toast is shown

        // Extract meaningful error message or use a fallback
        const backendMessage = error.response.data?.message; // Message from backend
        const defaultMessage = "Your session has expired. Please log in again.";
        const errorMessage = backendMessage || defaultMessage;

        toast.error(errorMessage); // Display the error message
        // Token is expired or invalid, redirect to the "/" route
        if (token) {
          localStorage.removeItem("sal_cam_token");
        }
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);

        // Reset toast flag after redirection
        setTimeout(() => {
          isToastShown = false;
        }, 3000); // Reset the flag after a short delay
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
