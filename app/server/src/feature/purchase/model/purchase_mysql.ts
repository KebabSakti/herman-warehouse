import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { BadRequest } from "../../../common/error";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { now } from "../../../helper/util";
import { Inventory } from "../../inventory/model/inventory_model";
import { PurchaseApi } from "./purchase_api";
import { Purchase } from "./purchase_model";
import { PurchaseCreate, PurchaseList, PurchaseUpdate } from "./purchase_type";

export class PurchaseMysql implements PurchaseApi {
  async list(param: PurchaseList): Promise<Result<Purchase[]>> {
    let table = `select * from purchases where deleted is null`;

    if (param.search != null) {
      const search = pool.escape(param.search);
      table += ` and (supplierName like "%"${search}"%" or supplierPhone like "%"${search}"%" or code like "%"${search}"%")`;
    }

    if (param.start != null && param.end != null) {
      const startDate = dayjs
        .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      const endDate = dayjs
        .tz(`${param.start}T23:59:59`, "Asia/Kuala_Lumpur")
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");

      const start = pool.escape(startDate);
      const end = pool.escape(endDate);
      table += ` and created between ${start} and ${end}`;
    }

    if (param.supplierId != null) {
      table += ` and supplierId = ${pool.escape(param.supplierId)}`;
    }

    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    table += ` order by created desc limit ${limit} offset ${offset}`;

    let query = `
    select purchases.*, inventories.*, payments.*, ledgers.*
    from (${table}) as purchases
    left join inventories on purchases.id = inventories.purchaseId
    left join payments on purchases.id = payments.purchaseId
    left join ledgers on purchases.id = ledgers.purchaseId
    order by purchases.created desc
    `;

    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((acc: any[], current: any) => {
      // Find existing purchase in the accumulated result
      let purchase = acc.find((item: any) => item.id === current.purchases.id);

      if (!purchase) {
        // Create a new purchase entry if it doesn't exist
        purchase = {
          ...current.purchases,
          inventory: [],
          payment: [],
          ledger: [],
        };

        acc.push(purchase);
      }

      // Add inventory if not already present
      if (
        current.inventories &&
        !purchase.inventory.some(
          (inv: any) => inv.id === current.inventories.id
        )
      ) {
        purchase.inventory.push(current.inventories);
      }

      // Add payment if not already present
      if (
        current.payments &&
        !purchase.payment.some((pay: any) => pay.id === current.payments.id)
      ) {
        if (current.payments.id) {
          purchase.payment.push(current.payments);
        }
      }

      // Add ledger if not already present
      if (
        current.ledgers &&
        !purchase.ledger.some((led: any) => led.id === current.ledgers.id)
      ) {
        if (current.ledgers.id) {
          purchase.ledger.push(current.ledgers);
        }
      }

      return acc;
    }, []);

    const total =
      param.search || param.supplierId || (param.start && param.end)
        ? result.length
        : (
            await MySql.query(
              "select count(*) as total from purchases where deleted is null"
            )
          )[0].total;

    const data = {
      data: result,
      paging: {
        page: param.page,
        limit: param.limit,
        total: total,
      },
    };

    return data;
  }

  async findBySupplierId(
    id: string,
    param?: Record<string, any> | null | undefined
  ): Promise<Result<Purchase[]>> {
    let table = `select * from purchases where deleted is null and supplierId = ${pool.escape(
      id
    )}`;

    if (param) {
      if (param.search) {
        const search = pool.escape(param.search);
        table += ` and code like "%"${search}"%"`;
      }

      if (param.start && param.end) {
        const startDate = dayjs
          .tz(`${param.start}T00:00:00`, "Asia/Kuala_Lumpur")
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");

        const endDate = dayjs
          .tz(`${param.start}T23:59:59`, "Asia/Kuala_Lumpur")
          .utc()
          .format("YYYY-MM-DD HH:mm:ss");

        const start = pool.escape(startDate);
        const end = pool.escape(endDate);
        table += ` and created between ${start} and ${end}`;
      }

      if (
        param.page &&
        param.limit &&
        !isNaN(param.page) &&
        !isNaN(param.limit)
      ) {
        const offset = (param.page - 1) * param.limit;
        const limit = param.limit;
        table += ` order by created desc limit ${limit} offset ${offset}`;
      }
    }

    let query = `
    select purchases.*, inventories.*, payments.*, ledgers.*
    from (${table}) as purchases
    left join inventories on purchases.id = inventories.purchaseId
    left join payments on purchases.id = payments.purchaseId
    left join ledgers on purchases.id = ledgers.purchaseId
    order by purchases.created desc
    `;

    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((acc: any[], current: any) => {
      // Find existing purchase in the accumulated result
      let purchase = acc.find((item: any) => item.id === current.purchases.id);

      if (!purchase) {
        // Create a new purchase entry if it doesn't exist
        purchase = {
          ...current.purchases,
          inventory: [],
          payment: [],
          ledger: [],
        };

        acc.push(purchase);
      }

      // Add inventory if not already present
      if (
        current.inventories &&
        !purchase.inventory.some(
          (inv: any) => inv.id === current.inventories.id
        )
      ) {
        purchase.inventory.push(current.inventories);
      }

      // Add payment if not already present
      if (
        current.payments &&
        !purchase.payment.some((pay: any) => pay.id === current.payments.id)
      ) {
        if (current.payments.id) {
          purchase.payment.push(current.payments);
        }
      }

      // Add ledger if not already present
      if (
        current.ledgers &&
        !purchase.ledger.some((led: any) => led.id === current.ledgers.id)
      ) {
        if (current.ledgers.id) {
          purchase.ledger.push(current.ledgers);
        }
      }

      return acc;
    }, []);

    const total = param
      ? result.length
      : (
          await MySql.query(
            `select count(*) as total from purchases where deleted is null and supplierId = ${pool.escape(
              id
            )}`
          )
        )[0].total;

    const data = {
      data: result,
      paging: {
        page: param?.page,
        limit: param?.limit,
        total: total,
      },
    };

    return data;
  }

  async create(param: PurchaseCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = now();

      if (param.outstanding != null && param.outstanding > 0) {
        const purchase = await new Promise<Purchase>((resolve, reject) => {
          connection.query(
            "select * from purchases where deleted is null and supplierId = ? order by created desc limit 1",
            param.supplierId,
            (err, res) => {
              if (err && res.length == 0) reject(err);
              resolve(res[0]);
            }
          );
        });

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "update purchases set balance = ? where id = ?",
            [0.0, purchase.id],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      // PURCHASE TABLE
      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into purchases set ?",
          {
            id: param.id,
            supplierId: param.supplierId,
            supplierName: param.supplierName,
            supplierPhone: param.supplierPhone,
            supplierAddress: param.supplierAddress,
            supplierNote: param.supplierNote,
            code: param.code,
            fee: param.fee,
            margin: param.margin,
            totalitem: param.totalItem,
            dp: param.dp,
            other: param.other,
            outstanding: param.outstanding,
            total: param.total,
            balance: param.balance,
            note: param.note,
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

      // LEDGERS TABLE
      if (param.ledger && param.ledger.length > 0) {
        const ledgers = param.ledger.map((ledger) => [
          ledger.id,
          param.id,
          param.supplierId,
          ledger.amount,
          param.total,
          ledger.file && ledger.id + ".jpg",
          ledger.note,
          ledger.dp,
          today,
          today,
        ]);

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into ledgers (id,purchaseId,supplierId,amount,outstanding,file,note,dp,created,updated) values ?",
            [ledgers],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      // PAYMENT TABLE
      if (param.payment && param.payment.length > 0) {
        const payments = param.payment.map((payment) => [
          payment.id,
          payment.purchaseId,
          payment.amount,
          payment.note,
          today,
          today,
        ]);

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into payments (id,purchaseId,amount,note,created,updated) values ?",
            [payments],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      // INVENTORY & STOCK TABLE
      const invStock = param.inventory.reduce(
        (a: any, inventory) => {
          return {
            ...a,
            inventories: [
              ...a.inventories,
              [
                inventory.id,
                inventory.purchaseId,
                inventory.productId,
                inventory.productCode,
                inventory.productName,
                inventory.productNote,
                inventory.qty,
                inventory.price,
                inventory.total,
                today,
                today,
              ],
            ],
            stocks: [
              ...a.stocks,
              [
                randomUUID(),
                param.supplierId,
                inventory.productId,
                inventory.qty,
                inventory.price,
                today,
                today,
              ],
            ],
          };
        },
        { inventories: [], stocks: [] }
      );

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into inventories (id,purchaseId,productId,productCode,productName,productNote,qty,price,total,created,updated) values ?",
          [invStock.inventories],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into stocks (id,supplierId,productId,qty,price,created,updated) values ? on duplicate key update qty = qty + values(qty), updated = values(updated)",
          [invStock.stocks],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update suppliers set outstanding = ? where id = ?",
          [param.total, param.supplierId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    });
  }

  async read(id: string): Promise<Purchase | null | undefined> {
    const query = `
        select purchases.*, inventories.*, payments.*, ledgers.*
        from purchases
        left join inventories on purchases.id = inventories.purchaseId
        left join payments on purchases.id = payments.purchaseId
        left join ledgers on purchases.id = ledgers.purchaseId
        where purchases.deleted is null
        and purchases.id = ${pool.escape(id)}`;

    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((acc: any[], current: any) => {
      // Find existing purchase in the accumulated result
      let purchase = acc.find((item: any) => item.id === current.purchases.id);

      if (!purchase) {
        // Create a new purchase entry if it doesn't exist
        purchase = {
          ...current.purchases,
          inventory: [],
          payment: [],
          ledger: [],
        };

        acc.push(purchase);
      }

      // Add inventory if not already present
      if (
        current.inventories &&
        !purchase.inventory.some(
          (inv: any) => inv.id === current.inventories.id
        )
      ) {
        purchase.inventory.push(current.inventories);
      }

      // Add payment if not already present
      if (
        current.payments &&
        !purchase.payment.some((pay: any) => pay.id === current.payments.id)
      ) {
        if (current.payments.id) {
          purchase.payment.push(current.payments);
        }
      }

      // Add ledger if not already present
      if (
        current.ledgers &&
        !purchase.ledger.some((led: any) => led.id === current.ledgers.id)
      ) {
        if (current.ledgers.id) {
          purchase.ledger.push(current.ledgers);
        }
      }

      return acc;
    }, []);

    if (result.length > 0) {
      return result[0];
    }

    return null;
  }

  async update(id: string, param: PurchaseUpdate): Promise<void> {
    //
  }

  async remove(id: string): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = new Date();

      const purchase = await new Promise<Purchase>((resolve, reject) => {
        connection.query(
          "select * from purchases where id = ?",
          [id],
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res[0]);
          }
        );
      });

      const inventories = await new Promise<Inventory[]>((resolve, reject) => {
        connection.query(
          "select * from inventories where purchaseId = ?",
          [id],
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res);
          }
        );
      });

      for await (let inventory of inventories) {
        const stock = await new Promise<any>((resolve, reject) => {
          connection.query(
            "select * from stocks where supplierId = ? and productId = ? and price = ?",
            [purchase.supplierId, inventory.productId, inventory.price],
            (err, res) => {
              if (err) reject(err);
              resolve(res[0]);
            }
          );
        });

        const invoices = await new Promise<any>((resolve, reject) => {
          connection.query(
            "select * from items where stockId = ?",
            [stock.id],
            (err, res) => {
              if (err) reject(err);
              resolve(res);
            }
          );
        });

        const ledgers = await new Promise<any>((resolve, reject) => {
          connection.query(
            "select * from ledgers where purchaseId = ?",
            [id],
            (err, res) => {
              if (err) reject(err);
              resolve(res);
            }
          );
        });

        if (invoices.length > 0 || ledgers.length > 0) {
          throw new BadRequest("Data tidak dapat dihapus");
        }

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "update stocks set qty = qty - ? where supplierId = ? and productId = ? and price = ?",
            [
              inventory.qty,
              purchase.supplierId,
              inventory.productId,
              inventory.price,
            ],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update suppliers set outstanding = ? where id = ?",
          [purchase.outstanding, purchase.supplierId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update purchases set deleted = ? where id = ?",
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
