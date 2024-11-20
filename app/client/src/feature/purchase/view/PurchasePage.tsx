import { Outlet } from "react-router-dom";
import { PurchaseList } from "./PurchaseList";

export function PurchasePage() {
  return (
    <>
      <Outlet />
      <PurchaseList />
    </>
  );
}
