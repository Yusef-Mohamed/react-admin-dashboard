import { axiosInstance } from "./axios.config";

export const getAllCoursesWithParams = async (params: string) => {
  const url = `/courses${params}`;
  const res = await axiosInstance.get(url);
  return res.data;
};
export const createCourse = async (data: FormData) => {
  const res = await axiosInstance.post("/courses", data);
  return res.data;
};
export const editCourse = async (data: FormData, id: string) => {
  const res = await axiosInstance.put(`/courses/${id}`, data);
  return res.data;
};
export const deleteCourse = async (id: string) => {
  const res = await axiosInstance.delete(`/courses/${id}`);
  return res.data;
};
