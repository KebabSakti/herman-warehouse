import { useContext } from "react";
import { Repository } from "../../../App";
import { AuthHookType } from "../auth/AuthHook";

export function DashboardPage() {
  const { auth }: { auth: AuthHookType } = useContext(Repository);

  console.log(auth.state);

  return <></>;
}
