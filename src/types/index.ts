export interface IUser {
  name: string;
  email: string;
  role: "user" | "admin";
  _id: string;
  phone: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  __v: number;
}
export interface NavItem {
  title: string;
  to: string;
  icon: React.ReactNode;
}
export interface IPagination {
  numberOfPages: number;
  limit: number;
  currentPage: number;
  results: number;
}
export interface ApiError {
  param: string;
  msg: string;
}
export interface IInputProps {
  type: string;
  label: string;
  placeholder: string;
  hideOnEdit?: boolean;
  values?: {
    value: string;
    label: string;
  }[];
}
