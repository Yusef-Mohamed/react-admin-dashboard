import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "../lib/cookies";

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL as string,
};

export const axiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
