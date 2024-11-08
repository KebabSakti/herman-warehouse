import { useEffect, useState } from "react";
import { State } from "../../../common/type";
import { AuthLoginParam } from "../../../feature/auth/model/auth_type";
import { AuthRepository } from "../../../feature/auth/repository/auth_repository";
import { authRepository } from "../../service";

export type AuthHookType = {
  init(): void;
  login(param: AuthLoginParam): Promise<void>;
  logout(): void;
  state: State<string>;
};

export function useAuthHook(): AuthHookType {
  const [state, setState] = useState<State<string>>({
    action: "idle",
    status: "idle",
  });

  useEffect(() => {
    init();
  }, []);

  function init(): void {
    setState({ action: "init", status: "loading" });
    const token = authRepository.load();
    setState({ action: "init", status: "complete", data: token });
  }

  async function login(param: AuthLoginParam): Promise<void> {
    try {
      setState({ action: "login", status: "loading" });
      const token = await authRepository.login(param);
      setState({ action: "login", status: "complete", data: token });
    } catch (error: any) {
      setState({ action: "login", status: "complete", error: error });
    }
  }

  function logout(): void {
    setState({ action: "logout", status: "loading" });
    authRepository.logout();
    setState({ action: "logout", status: "complete", data: null });
  }

  return { init, login, logout, state };
}
