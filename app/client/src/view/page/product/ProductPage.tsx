import { Outlet } from "react-router-dom";
import { ProductList } from "./ProductList";

export function ProductPage() {
  return (
    <>
      <Outlet />
      <ProductList />
    </>
  );
}
