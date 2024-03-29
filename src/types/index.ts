export interface IUser {
  name: string;
  email: string;
  role: "user" | "admin";
  _id: string;
  phone: string;
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
  type:
    | "text"
    | "email"
    | "password"
    | "textArea"
    | "select"
    | "file"
    | "number";
  label: string;
  placeholder: string;
  hideOnEdit?: boolean;
  values?: {
    value: string;
    label: string;
  }[];
}
export interface ICategory {
  title: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICourse {
  title: string;
  description: string;
  image: string;
  price: string;
  priceAfterDiscount?: string;
  category: ICategory;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface ILesson {
  course: ICourse;
  title: string;
  image: string;
  videoUrl: string;
  _id: string;
}
export interface IBlog {
  title: string;
  videoUrl: string;
  imageCover: string;
  content: string;
  description: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
export interface IOrder {
  user: IUser;
  course: ICourse;
  isPaid: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string;
  paymentMethodType: string;
  totalOrderPrice: number;
  paymentReceipt: string;
  paymentMethodTypeLabel: string;
}
export interface IBook {
  title: string;
  image: string;
  bookUrl: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
