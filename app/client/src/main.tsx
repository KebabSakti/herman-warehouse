import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./component/App";
import "react-toastify/dist/ReactToastify.css";
// import "./asset/style.css";
import "antd/dist/reset.css";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
dayjs.extend(utc);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
