import { createContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./view/component/Layout";
import { LoginPage } from "./view/page/auth/LoginPage";
import { DashboardPage } from "./view/page/dashboard/DashboardPage";
import { Middleware } from "./view/page/Middleware";
import { AuthRepository } from "./feature/auth/repository/auth_repository";
import { useAuthHook } from "./view/page/auth/AuthHook";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <Layout />
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
