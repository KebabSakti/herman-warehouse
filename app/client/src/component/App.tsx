import { createContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { Middleware } from "../component/Middleware";
import { AuthController } from "../feature/authentication/controller/auth_controller";
import { AuthApi } from "../feature/authentication/model/auth_api";
import { AuthAxios } from "../feature/authentication/model/auth_axios";
import {
  AuthHookType,
  useAuthHook,
} from "../feature/authentication/view/AuthHook";
import { LoginPage } from "../feature/authentication/view/LoginPage";
import { DashboardPage } from "../feature/dashboard/view/DashboardPage";
import { ProductController } from "../feature/product/controller/product_controller";
import { ProductApi } from "../feature/product/model/product_api";
import { ProductAxios } from "../feature/product/model/product_axios";
import { ProductCreate } from "../feature/product/view/ProductCreate";
import { ProductEdit } from "../feature/product/view/ProductEdit";
import { ProductPage } from "../feature/product/view/ProductPage";
import { PurchaseController } from "../feature/purchase/controller/purchase_controller";
import { PurchaseApi } from "../feature/purchase/model/purchase_api";
import { PurchaseAxios } from "../feature/purchase/model/purchase_axios";
import { PurchaseCreate } from "../feature/purchase/view/PurchaseCreate";
import { PurchaseEdit } from "../feature/purchase/view/PurchaseEdit";
import { PurchaseList } from "../feature/purchase/view/PurchaseList";
import { PurchasePrint } from "../feature/purchase/view/PurchasePrint";
import { PurchaseRead } from "../feature/purchase/view/PurchaseRead";
import { SupplierController } from "../feature/supplier/controller/supplier_controller";
import { SupplierApi } from "../feature/supplier/model/supplier_api";
import { SupplierAxios } from "../feature/supplier/model/supplier_axios";
import { Root } from "./Root";

export type Dependency = {
  auth: AuthHookType;
  productController: ProductController;
  supplierController: SupplierController;
  purchaseController: PurchaseController;
};

export const Dependency = createContext<Dependency | null>(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/print",
    children: [
      {
        path: "/print/inventory/:id",
        element: <PurchasePrint />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <Middleware>
        <Root />
      </Middleware>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" />,
      },
      {
        path: "/app/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/app/inventory",
        element: <Outlet />,
        children: [
          {
            path: "/app/inventory",
            element: <PurchaseList />,
            children: [
              {
                path: "/app/inventory/read/:id",
                element: <PurchaseRead />,
              },
            ],
          },
          {
            path: "/app/inventory/create",
            element: <PurchaseCreate />,
          },
          {
            path: "/app/inventory/edit/:id",
            element: <PurchaseEdit />,
          },
        ],
      },
      {
        path: "/app/order",
        element: <></>,
      },
      {
        path: "/app/supplier",
        element: <></>,
      },
      {
        path: "/app/customer",
        element: <></>,
      },
      {
        path: "/app/report",
        element: <></>,
      },
      {
        path: "/app/product",
        element: <ProductPage />,
        children: [
          {
            path: "/app/product/create",
            element: <ProductCreate />,
          },
          {
            path: "/app/product/edit/:id",
            element: <ProductEdit />,
          },
        ],
      },
      {
        path: "/app/account",
        element: <></>,
      },
      {
        path: "/app/log",
        element: <></>,
      },
    ],
  },
]);

export function App() {
  const authApi: AuthApi = new AuthAxios();
  const productApi: ProductApi = new ProductAxios();
  const supplierApi: SupplierApi = new SupplierAxios();
  const purchaseApi: PurchaseApi = new PurchaseAxios();

  const dependencies: Dependency = {
    auth: useAuthHook(new AuthController(authApi)),
    productController: new ProductController(productApi),
    supplierController: new SupplierController(supplierApi),
    purchaseController: new PurchaseController(purchaseApi),
  };

  return (
    <Dependency.Provider value={dependencies}>
      <RouterProvider router={router} />
    </Dependency.Provider>
  );
}
