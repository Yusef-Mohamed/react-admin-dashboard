import { axiosInstance } from "./axios.config";

export const getBookSubCategories = async (url: string = "") => {
  const res = await axiosInstance.get(`/subCategoryBooks${url}`);
  return res.data;
};
export const createBookSubCategory = async (data: object) => {
  const res = await axiosInstance.post("/subCategoryBooks", data);
  return res.data;
};
export const editBookSubCategory = async (data: object, id: string) => {
  const res = await axiosInstance.put(`/subCategoryBooks/${id}`, data);
  return res.data;
};
export const deleteBookSubCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/subCategoryBooks/${id}`);
  return res.data;
};
