import { Outlet } from "react-router-dom";
import { PurchaseListComponent } from "./PurchaseListComponent";

export function PurchasePage() {
  return (
    <>
      <Outlet />
      <PurchaseListComponent />
    </>
  );
}
