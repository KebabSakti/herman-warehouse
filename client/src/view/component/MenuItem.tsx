import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export type MenuItemProp = {
  name: string;
  link: string;
  icon: ReactNode;
};

export function MenuItem(param: MenuItemProp) {
  const location = useLocation();
  const path = location.pathname.match(/[^/]+$/)?.[0] || "";
  const isActive = path == param.name.toLowerCase();
  const active = isActive
    ? "bg-primary text-onprimary font-semibold rounded-lg"
    : "hover:bg-gray-50 hover:rounded-lg";

  return (
    <li>
      <Link
        to={param.link}
        className={`flex gap-4 items-center p-2 ${active}`}
      >
        {param.icon}
        <span>{param.name}</span>
      </Link>
    </li>
  );
}
