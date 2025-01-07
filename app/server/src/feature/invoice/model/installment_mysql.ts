import { NotFound } from "../../../common/error";
import { Result } from "../../../common/type";
import { MySql } from "../../../helper/mysql";
import { InstallmentApi } from "./installment_api";
import { Installment } from "./installment_model";
import { InstallmentCreate, InstallmentList } from "./installment_types";

export class InstallmentMysql implements InstallmentApi {
  async list(param: InstallmentList): Promise<Result<Installment[]>> {
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;

    const result = await MySql.query(
      "select * from installments where deleted is null and invoiceId = ? order by created desc limit ? offset ?",
      [param.invoiceId, limit, offset]
    );

    const data = {
      data: result,
      paging: {
        page: param.page,
        limit: param.limit,
        total: result.length,
      },
    };

    return data;
  }

  async create(param: InstallmentCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = new Date();

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into installments set ?",
          {
            id: param.id,
            invoiceid: param.invoiceId,
            amount: param.amount,
            outstanding: param.outstanding,
            note: param.note,
            attachment: param.attachment,
            printed: param.printed,
            created: today,
            updated: today,
          },
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update customers set outstanding = outstanding - ? where id = ?",
          [param.amount, param.customerId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });
  }

  async remove(id: string): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = new Date();

      const installment = await new Promise<Installment>((resolve, reject) => {
        connection.query(
          "select * from installments where id = ?",
          id,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res);
          }
        );
      });

      if (!installment) {
        throw new NotFound();
      }

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update customers set outstanding = outstanding + ?, where id = ?",
          [installment.amount, id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update installments set deleted = ? where id = ?",
          [today, id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });
  }
}
