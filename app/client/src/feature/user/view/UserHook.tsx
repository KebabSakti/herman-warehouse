import { useEffect, useState } from "react";
import { State } from "../../../common/type";
import { AuthLoginParam } from "../../auth/model/auth_type";
import { UserController } from "../controller/user_controller";
import { UserLogin } from "../model/user_type";

export type UserHookType = {
  init(): void;
  login(param: UserLogin): Promise<void>;
  logout(): void;
  state: State<string>;
};

export function useUserHook(userController: UserController): UserHookType {
  const [state, setState] = useState<State<string>>({
    action: "idle",
    status: "idle",
  });

  useEffect(() => {
    init();
  }, []);

  function init(): void {
    setState({ action: "init", status: "loading" });
    const token = userController.load();
    setState({ action: "init", status: "complete", data: token });
  }

  async function login(param: AuthLoginParam): Promise<void> {
    try {
      setState({ action: "login", status: "loading" });
      const token = await userController.login(param);
      setState({ action: "login", status: "complete", data: token });
    } catch (error: any) {
      setState({ action: "login", status: "complete", error: error });
    }
  }

  function logout(): void {
    setState({ action: "logout", status: "loading" });
    userController.logout();
    setState({ action: "logout", status: "complete", data: null });
  }

  return { init, login, logout, state };
}
