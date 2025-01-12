import { useState } from "react";
import { State } from "../../../common/type";
import { OutstandingController } from "../controller/outstanding_controller";
import {
  OutstandingList,
  OutstandingSummary,
} from "../model/outstanding_model";

type OutstandingState = State<OutstandingSummary>;

export type OutstandingHookType = {
  state: OutstandingState;
  list(param: OutstandingList, extra?: Record<string, any>): Promise<void>;
};

export function useOutstandingHook(
  outstandingController: OutstandingController
): OutstandingHookType {
  const [state, setState] = useState<OutstandingState>({
    action: "idle",
    status: "idle",
  });

  async function list(
    param: OutstandingList,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      setState({ ...state, action: "list", status: "loading" });
      const data = await outstandingController.list(param, extra);
      setState({ action: "list", status: "complete", data: data });
    } catch (error: any) {
      setState({ ...state, action: "list", status: "complete", error: error });
    }
  }

  return { state, list };
}
