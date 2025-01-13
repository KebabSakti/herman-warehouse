import { useState } from "react";
import { State } from "../../../common/type";
import { UserController } from "../controller/user_controller";
import { User, UserCreate, UserList, UserSummary } from "../model/user_type";

type UserState = State<UserSummary | User | null | undefined>;

export type UserHookType = {
  state: UserState;
  list(param: UserList, extra?: Record<string, any>): Promise<void>;
  create(param: UserCreate, extra?: Record<string, any>): Promise<void>;
  read(id: string, extra?: Record<string, any>): Promise<void>;
  update(id: string, param: User, extra?: Record<string, any>): Promise<void>;
  remove(id: string, extra?: Record<string, any>): Promise<void>;
};

export function useUserHook(userController: UserController): UserHookType {
  const [state, setState] = useState<UserState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: UserList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await userController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  async function create(
    param: User,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "create", status: "loading" });
      await userController.create(param, extra);
      setState({ action: "create", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "create",
        status: "complete",
        error: error,
      });
    }
  }

  async function read(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      setState({ ...state, action: "read", status: "loading" });
      const data = await userController.read(id, extra);
      setState({ action: "read", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "read", status: "complete", error: error });
    }
  }

  async function update(
    id: string,
    param: User,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "update", status: "loading" });
      await userController.update(id, param, extra);
      setState({ action: "update", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "update",
        status: "complete",
        error: error,
      });
    }
  }

  async function remove(
    id: string,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "remove", status: "loading" });
      await userController.remove(id, extra);
      setState({ action: "remove", status: "complete" });
    } catch (error: any) {
      setState({
        ...state,
        action: "remove",
        status: "complete",
        error: error,
      });
    }
  }

  return { state, list, create, read, update, remove };
}
