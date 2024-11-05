import {
  HiBookOpen,
  HiChartPie,
  HiClipboard,
  HiCube,
  HiKey,
  HiShoppingBag,
  HiTemplate,
  HiTruck,
  HiUserGroup,
} from "react-icons/hi";
import { MenuItem } from "./MenuItem";

export function Menu() {
  return (
    <ul className="flex flex-col gap-2 text-oncontainer">
      <MenuItem
        name="Dashboard"
        link="/app/dashboard"
        icon={<HiChartPie size={24} />}
      />
      <MenuItem
        name="Inventory"
        link="/app/inventory"
        icon={<HiTemplate size={24} />}
      />
      <MenuItem
        name="Order"
        link="/app/order"
        icon={<HiShoppingBag size={24} />}
      />
      <MenuItem
        name="Supplier"
        link="/app/supplier"
        icon={<HiTruck size={24} />}
      />
      <MenuItem
        name="Customer"
        link="/app/customer"
        icon={<HiUserGroup size={24} />}
      />
      <MenuItem
        name="Report"
        link="/app/report"
        icon={<HiBookOpen size={24} />}
      />
      <MenuItem
        name="Product"
        link="/app/product"
        icon={<HiCube size={24} />}
      />
      <MenuItem name="Account" link="/app/account" icon={<HiKey size={24} />} />
      <MenuItem name="Log" link="/app/log" icon={<HiClipboard size={24} />} />
    </ul>
  );
}
