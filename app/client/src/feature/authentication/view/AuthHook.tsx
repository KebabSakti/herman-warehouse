import { useEffect, useState } from "react";
import { State } from "../../../common/type";
import { AuthLoginParam } from "../../auth/model/auth_type";
import { AuthController } from "../controller/auth_controller";
import { AuthLogin } from "../model/auth_type";

export type AuthHookType = {
  init(): void;
  login(param: AuthLogin): Promise<void>;
  logout(): void;
  state: State<string | null | undefined>;
};

export function useAuthHook(authController: AuthController): AuthHookType {
  const [state, setState] = useState<State<string>>({
    action: "idle",
    status: "idle",
  });

  useEffect(() => {
    init();
  }, []);

  function init(): void {
    setState({ action: "init", status: "loading" });
    const token = authController.load();
    setState({ action: "init", status: "complete", data: token });
  }

  async function login(param: AuthLoginParam): Promise<void> {
    try {
      setState({ action: "login", status: "loading" });
      const token = await authController.login(param);
      setState({ action: "login", status: "complete", data: token });
    } catch (error: any) {
      setState({ action: "login", status: "complete", error: error });
    }
  }

  function logout(): void {
    setState({ action: "logout", status: "loading" });
    authController.logout();
    setState({ action: "logout", status: "complete", data: null });
  }

  return { init, login, logout, state };
}
