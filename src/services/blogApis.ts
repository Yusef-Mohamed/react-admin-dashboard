import { axiosInstance } from "./axios.config";

export const getAllBlogsWithParams = async (url: string = "") => {
  const res = await axiosInstance.get(`/articals${url}`);
  return res.data;
};
export const createBlog = async (data: object) => {
  const res = await axiosInstance.post("/articals", data);
  return res.data;
};
export const editBlog = async (data: object, id: string) => {
  const res = await axiosInstance.put(`/articals/${id}`, data);
  return res.data;
};
export const deleteBlog = async (id: string) => {
  const res = await axiosInstance.delete(`/articals/${id}`);
  return res.data;
};
