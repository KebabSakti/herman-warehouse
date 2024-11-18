import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./component/App";
import "react-toastify/dist/ReactToastify.css";
import "./asset/style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
