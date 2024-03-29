import { axiosInstance } from "./axios.config";

export const getAllBooksWithParams = async (params: string) => {
  const url = `/books${params}`;
  const res = await axiosInstance.get(url);
  return res.data;
};
export const createBook = async (data: FormData) => {
  const res = await axiosInstance.post("/books", data);
  return res.data;
};
export const editBook = async (data: FormData, id: string) => {
  const res = await axiosInstance.put(`/books/${id}`, data);
  return res.data;
};
export const deleteBook = async (id: string) => {
  const res = await axiosInstance.delete(`/books/${id}`);
  return res.data;
};
export const addUserToBook = async (id: string, email: string) => {
  const res = await axiosInstance.post(`/books/${id}/addUserToBook`, {
    email: email,
  });
  return res.data;
};
