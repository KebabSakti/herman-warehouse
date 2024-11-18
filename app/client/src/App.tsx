import { createContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { AuthController } from "./feature/authentication/controller/auth_controller";
import { AuthApi } from "./feature/authentication/model/auth_api";
import { AuthAxios } from "./feature/authentication/model/auth_axios";
import {
  AuthHookType,
  useAuthHook,
} from "./feature/authentication/view/AuthHook";
import { LoginPage } from "./feature/authentication/view/LoginPage";
import { ProductController } from "./feature/product/controller/product_controller";
import { ProductApi } from "./feature/product/model/product_api";
import { ProductAxios } from "./feature/product/model/product_axios";
import { ProductCreate } from "./feature/product/view/ProductCreate";
import { ProductEdit } from "./feature/product/view/ProductEdit";
import { ProductPage } from "./feature/product/view/ProductPage";
import { PurchaseController } from "./feature/purchase/controller/purchase_controller";
import { PurchaseApi } from "./feature/purchase/model/purchase_api";
import { PurchaseAxios } from "./feature/purchase/model/purchase_axios";
import { PurchaseCreateComponent } from "./feature/purchase/view/PurchaseCreateComponent";
import { PurchasePage } from "./feature/purchase/view/PurchasePage";
import { UserController } from "./feature/user/controller/user_controller";
import { UserApi } from "./feature/user/model/user_api";
import { UserAxios } from "./feature/user/model/user_axios";
import { UserHookType, useUserHook } from "./feature/user/view/UserHook";
import { Root } from "./view/component/Root";
import { DashboardPage } from "./feature/dashboard/view/DashboardPage";
import { Middleware } from "./view/page/Middleware";

export type Dependency = {
  auth: AuthHookType;
  user: UserHookType;
  productController: ProductController;
  purchaseController: PurchaseController;
};

export const Repository = createContext<Dependency | null>(null);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
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
        element: <PurchasePage />,
        children: [
          {
            path: "/app/inventory/create",
            element: <PurchaseCreateComponent />,
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
  const userApi: UserApi = new UserAxios();
  const productApi: ProductApi = new ProductAxios();
  const purchaseApi: PurchaseApi = new PurchaseAxios();

  const dependencies: Dependency = {
    auth: useAuthHook(new AuthController(authApi)),
    user: useUserHook(new UserController(userApi)),
    productController: new ProductController(productApi),
    purchaseController: new PurchaseController(purchaseApi),
  };

  return (
    <Repository.Provider value={dependencies}>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={true}
        theme="light"
        transition={Flip}
      />
      <RouterProvider router={router} />
    </Repository.Provider>
  );
}
