import { BarChart, UserIcon } from "lucide-react";
import { NavItem } from "../types";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdOutlineCastForEducation } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { TfiWrite } from "react-icons/tfi";
import { FaMoneyBill1 } from "react-icons/fa6";

export const navItems: NavItem[] = [
  {
    title: "Overview",
    to: "/dashboard/overview",
    icon: <BarChart className="mr-1" />,
  },
  {
    title: "Users",
    to: "/dashboard/users",
    icon: <UserIcon className="mr-1" />,
  },
  {
    title: "Categories",
    to: "/dashboard/categories",
    icon: <BiSolidCategoryAlt className="mr-1" />,
  },
  {
    title: "Courses",
    to: "/dashboard/courses",
    icon: <PiStudentBold className="mr-1" />,
  },
  {
    title: "Lessons",
    to: "/dashboard/lessons",
    icon: <MdOutlineCastForEducation className="mr-1" />,
  },
  {
    title: "Blog",
    to: "/dashboard/blogs",
    icon: <TfiWrite className="mr-1" />,
  },
  {
    title: "Orders",
    to: "/dashboard/orders",
    icon: <FaMoneyBill1 className="mr-1" />,
  },
];
