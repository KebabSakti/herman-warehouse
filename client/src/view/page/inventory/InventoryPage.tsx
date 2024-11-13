import { Outlet } from "react-router-dom";
import { InventoryList } from "./InventoryList";

export function InventoryPage() {
  return (
    <>
      <Outlet />
      <InventoryList />
    </>
  );
}
