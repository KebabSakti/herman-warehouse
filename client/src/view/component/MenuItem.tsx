import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

export type MenuItemProp = {
  name: string;
  link: string;
  icon: ReactNode;
};

export function MenuItem(param: MenuItemProp) {
  const location = useLocation();
  const active = location.pathname == param.link;

  return (
    <li>
      <NavLink
        to={active ? param.link + location.search : param.link}
        className={({ isActive }) =>
          isActive
            ? "bg-primary text-onprimary font-semibold rounded-lg flex gap-4 items-center p-2"
            : "hover:bg-gray-50 hover:rounded-lg flex gap-4 items-center p-2"
        }
      >
        {param.icon}
        <span>{param.name}</span>
      </NavLink>
    </li>
  );
}
