import { BarChart, Share2Icon, UserIcon } from "lucide-react";
import { NavItem } from "../types";

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
    icon: <Share2Icon className="mr-1" />,
    // icon: </>,
  },
  {
    title: "Courses",
    to: "/dashboard/courses",
    icon: <Share2Icon className="mr-1" />,
  },
  {
    title: "Lessons",
    to: "/dashboard/lessons",
    icon: <Share2Icon className="mr-1" />,
  },
  {
    title: "Blog",
    to: "/dashboard/blogs",
    icon: <Share2Icon className="mr-1" />,
  },
];
