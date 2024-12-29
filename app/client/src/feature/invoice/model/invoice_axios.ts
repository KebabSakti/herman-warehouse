import axios from "axios";
import { server } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { InvoiceApi } from "./invoice_api";
import { Invoice } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";

export class InvoiceAxios implements InvoiceApi {
  async create(
    param: InvoiceCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    try {
      await axios({
        url: `${server}/app/invoice`,
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
  ): Promise<Invoice | null | undefined> {
    try {
      const result = await axios({
        url: `${server}/app/invoice/${id}`,
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
        url: `${server}/app/invoice/${id}`,
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
    param: InvoiceList,
    extra?: Record<string, any>
  ): Promise<Result<Invoice[]>> {
    try {
      const result = await axios.get(`${server}/app/invoice`, {
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
