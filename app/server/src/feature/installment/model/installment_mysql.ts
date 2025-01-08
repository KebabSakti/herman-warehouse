import { NotFound } from "../../../common/error";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { InstallmentApi } from "./installment_api";
import { Installment } from "./installment_model";
import { InstallmentCreate, InstallmentList } from "./installment_types";

export class InstallmentMysql implements InstallmentApi {
  async list(
    invoiceId: string,
    param: InstallmentList
  ): Promise<Result<Installment[]>> {
    let query = `select * from installments where deleted is null and invoiceId = ${pool.escape(
      invoiceId
    )}`;

    query += ` order by created desc`;

    if (param.page && param.limit) {
      const offset = (param.page - 1) * param.limit;
      const limit = param.limit;

      query += ` limit ${pool.escape(limit)} offset ${pool.escape(offset)}`;
    }

    const result = await MySql.query(query);

    const total = (
      await MySql.query(
        `select * from installments where deleted is null and invoiceId = ${pool.escape(
          invoiceId
        )}`
      )
    )[0]?.total;

    const data = {
      data: result,
      paging: {
        page: param.page ?? 0,
        limit: param.limit ?? 0,
        total: total,
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
          "update invoices set outstanding = ? where id = ?",
          [param.outstanding, param.invoiceId],
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
