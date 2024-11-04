import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Repository } from "../../App";
import { AuthHookType } from "./auth/AuthHook";
import { toast } from "react-toastify";

export function Middleware({ children }: { children: ReactNode }) {
  const { auth }: { auth: AuthHookType } = useContext(Repository);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.state.status == "complete" && auth.state.data == null) {
      toast.error("Login untuk melanjutkan");
      navigate("/", { replace: true });
    }
  }, [auth.state]);

  if (auth.state.data != null) {
    return children;
  }

  return (
    <>
      {(() => {
        return (
          <div className="h-screen flex justify-center items-center">
            LOADING...
          </div>
        );
      })()}
    </>
  );
}
