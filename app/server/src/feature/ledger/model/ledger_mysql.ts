import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { now } from "../../../helper/util";
import { LedgerApi } from "./ledger_api";
import { Ledger } from "./ledger_model";
import { LedgerCreate, LedgerList } from "./ledger_type";

export class LedgerMysql implements LedgerApi {
  async list(purchaseId: string, param: LedgerList): Promise<Result<Ledger[]>> {
    let query = `select * from ledgers where deleted is null and purchaseId = ${pool.escape(
      purchaseId
    )} order by created desc`;

    if (param.page && param.limit) {
      const offset = (param.page - 1) * param.limit;
      const limit = param.limit;
      query += ` limit ${limit} offset ${offset}`;
    }

    const result = await MySql.query(query);
    const total = (
      await MySql.query(
        `select * from ledgers where deleted is null and purchaseId = ${pool.escape(
          purchaseId
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

  async create(param: LedgerCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into ledgers set ?",
          {
            id: param.id,
            purchaseId: param.purchaseId,
            supplierId: param.supplierId,
            amount: param.amount,
            outstanding: param.outstanding,
            file: param.file && param.id + ".jpg",
            note: param.note,
            created: now(),
            updated: now(),
          },
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update purchases set balance = ? where id = ?",
          [param.outstanding, param.purchaseId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update suppliers set outstanding = outstanding - ? where id = ?",
          [param.amount, param.supplierId],
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
      const ledger = await new Promise<Ledger>((resolve, reject) => {
        connection.query(
          "select * from ledgers where id = ?",
          [id],
          (err, res) => {
            if (err && res.length == 0) reject(err);
            resolve(res[0]);
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update suppliers set outstanding = outstanding + ? where id = ?",
          [ledger.amount, ledger.supplierId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update purchases set balance =  balance + ?, updated = ? where id = ?",
          [ledger.amount, now(), ledger.purchaseId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query("delete from ledgers where id = ?", [id], (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }
}
