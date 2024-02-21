import { BarChart, Share2Icon, UserIcon } from "lucide-react";
import { NavItem } from "../types";

export const navItems: NavItem[] = [
  {
    title: "Overview",
    to: "/dashboard",
    icon: <BarChart className="mr-1" />,
  },
  {
    title: "Users",
    to: "/dashboard/users",
    icon: <UserIcon className="mr-1" />,
  },
  {
    title: "Blog",
    to: "/settings",
    icon: <Share2Icon className="mr-1" />,
  },
  {
    title: "Categories",
    to: "/logout",
    icon: <Share2Icon className="mr-1" />,
    // icon: </>,
  },
];
