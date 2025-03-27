import axios from "axios";

export const authAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URI,
  withCredentials: true,
});
