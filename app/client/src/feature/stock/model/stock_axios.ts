import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { StockApi } from "./stock_api";
import { Stock } from "./stock_model";
import { StockCreate, StockList } from "./stock_type";

export class StockAxios implements StockApi {
  async create(param: StockCreate, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${server}/app/stock`,
        method: "post",
        data: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Stock | null | undefined> {
    try {
      const result = await axios({
        url: `${server}/app/stock/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${server}/app/stock/${id}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async list(
    param: StockList,
    extra?: Record<string, any>
  ): Promise<Result<Stock[]>> {
    try {
      const result = await axios.get(`${server}/app/stock`, {
        params: param,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "application/json",
        },
      });

      return result.data;
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }
}
