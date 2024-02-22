import { axiosInstance } from "./axios.config";

export const getAllLessonsWithParams = async (params: string) => {
  const url = `/lessons${params}`;
  const res = await axiosInstance.get(url);
  return res.data;
};
export const createLesson = async (data: FormData) => {
  const res = await axiosInstance.post("/lessons", data);
  return res.data;
};
export const editLesson = async (data: FormData, id: string) => {
  const res = await axiosInstance.put(`/lessons/${id}`, data);
  return res.data;
};
export const deleteLesson = async (id: string) => {
  const res = await axiosInstance.delete(`/lessons/${id}`);
  return res.data;
};
