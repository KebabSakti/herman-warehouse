import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Middleware({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    //
  }, []);

  return children;

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
