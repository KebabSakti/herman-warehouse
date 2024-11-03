import { createContext, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./assets/index.css";
import Layout from "./view/component/Layout";
import { LoginPage } from "./view/page/auth/LoginPage";
import { DashboardPage } from "./view/page/dashboard/DashboardPage";
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

function App() {
  return (
    <Repository.Provider value={{ name: "udin" }}>
      <RouterProvider router={router} />
    </Repository.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
