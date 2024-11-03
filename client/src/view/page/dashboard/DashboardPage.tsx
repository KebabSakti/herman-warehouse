import { useContext } from "react";
import { Repository } from "../../../App";

export function DashboardPage() {
  const { auth } = useContext(Repository);

  console.log(auth.state);

  return <></>;
}
