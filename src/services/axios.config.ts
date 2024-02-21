import axios from "axios";
import { getCookie } from "../lib/cookies";
const token = getCookie("token");
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
