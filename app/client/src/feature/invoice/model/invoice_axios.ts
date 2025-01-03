import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { hmac, randomID } from "../../../helper/util";
import { InvoiceApi } from "./invoice_api";
import { Invoice } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";

export class InvoiceAxios implements InvoiceApi {
  async create(
    param: InvoiceCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    const formData = new FormData();

    if (param.installment) {
      for (let i = 0; i < param.installment.length; i++) {
        if (param.installment[i].attachment) {
          formData.append("file", param.installment[i].attachment as File);
          param.installment[i].attachment = randomID() + ".jpg";
        }
      }
    }

    const signature = await hmac(param, extra!.token);
    const data = { signature, param };

    formData.append("data", JSON.stringify(data));

    try {
      await axios({
        url: `${SERVER}/app/invoice`,
        method: "post",
        data: formData,
        headers: {
          Authorization: `Bearer ${extra?.token ?? ""}`,
          "Content-Type": "multipart/form-data",
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
        url: `${SERVER}/app/invoice/${id}`,
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
        url: `${SERVER}/app/invoice/${id}`,
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
      const result = await axios.get(`${SERVER}/app/invoice`, {
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
