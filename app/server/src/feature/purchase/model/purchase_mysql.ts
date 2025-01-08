import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { BadRequest, InternalFailure } from "../../../common/error";
import { Result } from "../../../common/type";
import { Invoice } from "../../../helper/invoice";
import { MySql, pool } from "../../../helper/mysql";
import { Product } from "../../product/model/product_type";
import { Supplier } from "../../supplier/model/supplier_model";
import { PurchaseApi } from "./purchase_api";
import { Inventory, Purchase } from "./purchase_model";
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
        .utc(`${param.start}T00:00:00`)
        .format("YYYY-MM-DD HH:mm:ss");

      const endDate = dayjs
        .utc(`${param.end}T23:59:59`)
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
    select purchases.*, inventories.*, payments.*
    from (${table}) as purchases
    left join inventories on purchases.id = inventories.purchaseId
    left join payments on purchases.id = payments.purchaseId
    `;

    query += ` order by purchases.created desc`;
    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((a: any, b: any) => {
      const purchase = a.find((c: any) => c.id == b.purchases.id);

      if (purchase == undefined) {
        const item = { ...b.purchases, inventory: [], payment: [] };

        if (b.inventories.purchaseId == item.id) {
          item.inventory.push(b.inventories);
        }

        if (b.payments.purchaseId == item.id) {
          item.payment.push(b.payments);
        }

        a.push(item);
      } else {
        const inventory = purchase.inventory.find(
          (c: any) => c.id == b.inventories.id
        );

        const payment = purchase.payment.find(
          (c: any) => c.id == b.payments.id
        );

        if (inventory == undefined) {
          purchase.inventory.push(b.inventories);
        }

        if (payment == undefined) {
          purchase.payment.push(b.payments);
        }
      }

      return a;
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

  async create(param: PurchaseCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      const supplier = await new Promise<Supplier>((resolve, reject) => {
        connection.query(
          "select * from suppliers where id = ?",
          param.supplierId,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res[0]);
          }
        );
      });

      const purchaseId = param.id;
      const today = new Date();
      const inventoryTotal = param.inventory.reduce(
        (a, b) => a + b.qty * b.price,
        0
      );
      const paymentTotal = param.payment.reduce((a, b) => a + b.amount, 0);
      const margin = inventoryTotal * (param.fee / 100);
      const total =
        inventoryTotal - margin - paymentTotal + supplier.outstanding;

      const productIds = param.inventory.reduce<string[]>(
        (a, b) => [...a, b.productId],
        []
      );

      const products = await new Promise<Product[]>((resolve, reject) => {
        connection.query(
          "select * from products where id in (?)",
          [productIds],
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res);
          }
        );
      });

      const inventories = param.inventory.map((e) => {
        const product = products.find((p) => p.id == e.productId);
        const itemTotal = e.qty * e.price;

        if (product == undefined) {
          throw new InternalFailure();
        }

        return [
          randomUUID(),
          purchaseId,
          product.id,
          product.code,
          product.name,
          product.note,
          e.qty,
          e.price,
          itemTotal,
          today,
          today,
        ];
      });

      const stocks = param.inventory.map((e) => {
        const product = products.find((p) => p.id == e.productId);

        if (product == undefined) {
          throw new InternalFailure();
        }

        return [
          randomUUID(),
          supplier.id,
          product.id,
          e.qty,
          e.price,
          today,
          today,
        ];
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into purchases set ?",
          {
            id: purchaseId,
            code: Invoice.supplier(),
            supplierId: supplier.id,
            supplierName: supplier.name,
            supplierPhone: supplier.phone,
            supplierAddress: supplier.address,
            fee: param.fee,
            margin: margin,
            total: inventoryTotal,
            balance: total,
            other: paymentTotal,
            note: param.note,
            outstanding: supplier.outstanding,
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
          "insert into inventories (id,purchaseId,productId,productCode,productName,productNote,qty,price,total,created,updated) values ?",
          [inventories],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into stocks (id,supplierId,productId,qty,price,created,updated) values ? on duplicate key update qty = qty + values(qty), updated = values(updated)",
          [stocks],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      if (param.payment.length > 0) {
        const payments = param.payment.map((e) => [
          randomUUID(),
          purchaseId,
          e.amount,
          e.note,
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

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update suppliers set outstanding = ? where id = ?",
          [total, supplier.id],
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
        select purchases.*, inventories.*, payments.*
        from purchases
        left join inventories on purchases.id = inventories.purchaseId
        left join payments on purchases.id = payments.purchaseId
        where purchases.deleted is null
        and purchases.id = ${pool.escape(id)}`;

    const purchases = await MySql.query({ sql: query, nestTables: true });
    const result = purchases.reduce((a: any, b: any) => {
      const purchase = a.find((c: any) => c.id == b.purchases.id);

      if (purchase == undefined) {
        const item = { ...b.purchases, inventory: [], payment: [] };

        if (b.inventories.purchaseId == item.id) {
          item.inventory.push(b.inventories);
        }

        if (b.payments.purchaseId == item.id) {
          item.payment.push(b.payments);
        }

        a.push(item);
      } else {
        const inventory = purchase.inventory.find(
          (c: any) => c.id == b.inventories.id
        );

        const payment = purchase.payment.find(
          (c: any) => c.id == b.payments.id
        );

        if (inventory == undefined) {
          purchase.inventory.push(b.inventories);
        }

        if (payment == undefined) {
          purchase.payment.push(b.payments);
        }
      }

      return a;
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
          throw new BadRequest("Proses tidak boleh dilakukan");
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
