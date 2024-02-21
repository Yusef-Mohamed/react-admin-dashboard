import { Dispatch, SetStateAction } from "react";
import { NavLink } from "react-router-dom";
import { NavItem } from "../../types";
import { cn } from "../../lib/utils";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        return (
          item.to && (
            <NavLink
              key={index}
              to={item.to}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  // path === item.href ? "bg-accent" : "transparent",
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </span>
            </NavLink>
          )
        );
      })}
    </nav>
  );
}
