import axios from "axios";
import { SERVER } from "../../../common/common";
import { Failure } from "../../../common/error";
import { Result } from "../../../common/type";
import { hmac, randomID } from "../../../helper/util";
import { InstallmentApi } from "./installment_api";
import { Installment } from "./installment_model";
import { InstallmentCreate, InstallmentList } from "./installment_types";

export class InstallmentAxios implements InstallmentApi {
  async create(
    param: InstallmentCreate,
    extra?: Record<string, any>
  ): Promise<void> {
    const formData = new FormData();

    if (param.attachment) {
      formData.append("file", param.attachment as File);
      param.attachment = randomID() + ".jpg";
    }

    const payload = JSON.stringify(param);
    const signature = await hmac(payload, extra!.token);
    formData.append("payload", payload);

    try {
      await axios({
        url: `${SERVER}/app/installment`,
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

  async remove(id: string, extra?: Record<string, any>): Promise<void> {
    try {
      await axios({
        url: `${SERVER}/app/installment/${id}`,
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
    invoiceId: string,
    param?: InstallmentList | null | undefined,
    extra?: Record<string, any>
  ): Promise<Result<Installment[]>> {
    try {
      const result = await axios.get(`${SERVER}/app/installment/${invoiceId}`, {
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
