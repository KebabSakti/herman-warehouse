import { ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dependency } from "./App";
import { Flex } from "antd";

export function Middleware({ children }: { children: ReactNode }) {
  const { auth } = useContext(Dependency)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.state.status == "complete" && auth.state.data == null) {
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
          <Flex align="center" justify="center" style={{ height: "100vh" }}>
            LOADING...
          </Flex>
        );
      })()}
    </>
  );
}
