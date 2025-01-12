import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { hmac } from "../../../helper/util";
import { ExpenseApi } from "./expense_api";
import { Expense, ExpenseSummary } from "./expense_model";

export class ExpenseAxios implements ExpenseApi {
  async create(param: Expense, extra?: Record<string, any>): Promise<void> {
    try {
      const formData = new FormData();

      if (param.file) {
        formData.append("file", param.file as File);
      }

      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);
      formData.append("payload", payload);

      await axios({
        url: `${SERVER}/app/expense`,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "multipart/form-data",
          "X-Signature": signature,
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async update(
    id: string,
    param: Expense,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      const formData = new FormData();

      if (param.file) {
        formData.append("file", param.file as File);
      }

      const payload = JSON.stringify(param);
      const signature = await hmac(payload, extra!.token);
      formData.append("payload", payload);

      await axios({
        url: `${SERVER}/app/expense/${id}`,
        method: "put",
        data: formData,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "multipart/form-data",
          "X-Signature": signature,
        },
      });
    } catch (error: any) {
      throw Failure(error.response.status, error.response.data);
    }
  }

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${SERVER}/app/expense/${id}`,
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
    param: Expense,
    extra?: Record<string, any>
  ): Promise<ExpenseSummary> {
    try {
      const result = await axios.get(`${SERVER}/app/expense/`, {
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

  async read(
    id: string,
    extra?: Record<string, any>
  ): Promise<Expense | null | undefined> {
    try {
      const result = await axios.get(`${SERVER}/app/expense/${id}`, {
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
