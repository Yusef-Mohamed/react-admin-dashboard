import { axiosInstance } from "./axios.config";

export const getCategories = async (url: string = "") => {
  const res = await axiosInstance.get(`/categories${url}`);
  return res.data;
};
export const createCategory = async (data: object) => {
  const res = await axiosInstance.post("/categories", data);
  return res.data;
};
export const editCategory = async (data: object, id: string) => {
  const res = await axiosInstance.put(`/categories/${id}`, data);
  return res.data;
};
export const deleteCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};
