import { axiosInstance } from "./axios.config";

export const getCategories = async (url: string = "") => {
  const res = await axiosInstance.get(`/categoryBooks${url}`);
  return res.data;
};
export const createCategory = async (data: object) => {
  const res = await axiosInstance.post("/categoryBooks", data);
  return res.data;
};
export const editCategory = async (data: object, id: string) => {
  const res = await axiosInstance.put(`/categoryBooks/${id}`, data);
  return res.data;
};
export const deleteCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/categoryBooks/${id}`);
  return res.data;
};
