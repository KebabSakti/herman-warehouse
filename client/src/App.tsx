import { createContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { AuthRepository } from "./feature/auth/repository/auth_repository";
import { Root } from "./view/component/Root";
import { useAuthHook } from "./view/page/auth/AuthHook";
import { LoginPage } from "./view/page/auth/LoginPage";
import { DashboardPage } from "./view/page/dashboard/DashboardPage";
import { InventoryPage } from "./view/page/inventory/InventoryPage";
import { Middleware } from "./view/page/Middleware";

export const Repository = createContext<any>(null);

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
        element: <InventoryPage />,
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
        element: <></>,
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
  const authRepository = new AuthRepository();

  const repositories = {
    auth: useAuthHook(authRepository),
  };

  return (
    <Repository.Provider value={repositories}>
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
