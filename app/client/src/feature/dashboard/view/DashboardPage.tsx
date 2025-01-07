import axios from "axios";
import { useContext, useEffect } from "react";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Dependency } from "../../../component/App";
import { hmac } from "../../../helper/util";

export function DashboardPage() {
  const { auth } = useContext(Dependency)!;
  const token = auth.state.data!;

  async function init(): Promise<void> {
    const data = {
      hello: "world",
    };
    const signature = await hmac(data, token);
    const jsonString = JSON.stringify({ signature, data });

    // await axios({
    //   url: `${SERVER}/app/test`,
    //   method: "post",
    //   data: jsonString,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    // });
  }

  useEffect(() => {
    try {
      init();
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }, []);

  return <></>;
}
