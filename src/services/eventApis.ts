import { axiosInstance } from "./axios.config";

export const getEvents = async (url: string = "") => {
  const res = await axiosInstance.get(`/events${url}`);
  return res.data;
};
export const createEvent = async (data: object) => {
  const res = await axiosInstance.post("/events", data);
  return res.data;
};
export const editEvent = async (data: object, id: string) => {
  const res = await axiosInstance.put(`/events/${id}`, data);
  return res.data;
};
export const deleteEvent = async (id: string) => {
  const res = await axiosInstance.delete(`/events/${id}`);
  return res.data;
};
