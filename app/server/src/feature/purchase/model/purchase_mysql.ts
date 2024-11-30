import dayjs from "dayjs";
import { randomUUID } from "crypto";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { Product } from "../../product/model/product_type";
import { Supplier } from "../../supplier/model/supplier_type";
import { PurchaseApi } from "./purchase_api";
import { Purchase, PurchaseCreate, PurchaseList } from "./purchase_type";

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

    const total = (await MySql.query(table)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    table += ` order by created desc limit ${limit} offset ${offset}`;

    let query = `
    select purchases.*, inventories.*, payments.*
    from (${table}) as purchases
    left join inventories on purchases.id = inventories.purchaseId
    left join payments on purchases.id = payments.purchaseId
    `;

    const purchases = await MySql.query({ sql: query, nestTables: true });

    const result = purchases.reduce((acc: any, item: any) => {
      const index = acc.findIndex((e: any) => e.id == item.purchases.id);

      if (index >= 0) {
        const invIndex = acc[index].inventory.findIndex(
          (e: any) => e.id == item.inventories.id
        );

        const payIndex = acc[index].payment.findIndex(
          (e: any) => e.id == item.payments.id
        );

        if (invIndex < 0) {
          if (item.inventories.id != null) {
            acc[index].inventory.push(item.inventories);
          }
        }

        if (payIndex < 0) {
          if (item.payments.id != null) {
            acc[index].payment.push(item.payments);
          }
        }
      } else {
        const element = { ...item.purchases, inventory: [], payment: [] };

        if (item.inventories.id != null) {
          element.inventory.push(item.inventories);
        }

        if (item.payments.id != null) {
          element.payment.push(item.payments);
        }

        acc.push(element);
      }

      return acc;
    }, []);

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
      const purchaseId = randomUUID();
      const today = new Date();

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

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into purchases set ?",
          {
            id: purchaseId,
            supplierId: supplier.id,
            supplierName: supplier.name,
            supplierPhone: supplier.phone,
            supplierAddress: supplier.address,
            code: param.code,
            fee: param.fee,
            total: param.total,
            paid: param.paid,
            balance: param.balance,
            other: param.other,
            note: param.note,
            created: today,
            updated: today,
          },
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      for await (let inventory of param.inventory) {
        const product = await new Promise<Product>((resolve, reject) => {
          connection.query(
            "select * from products where productId = ?",
            inventory.productId,
            (err, res) => {
              if (err) reject(err);
              if (res.length == 0) reject(err);
              resolve(res[0]);
            }
          );
        });

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into inventories set ?",
            {
              ...inventory,
              id: randomUUID(),
              purchaseId: purchaseId,
              productId: product.id,
              productCode: product.code,
              productName: product.name,
              productNote: product.note,
              created: today,
              updated: today,
            },
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      if (param.payment) {
        for await (let payment of param.payment) {
          await new Promise<void>((resolve, reject) => {
            connection.query(
              "insert into payments set ?",
              {
                ...payment,
                id: randomUUID(),
                purchaseId: purchaseId,
                created: today,
                updated: today,
              },
              (err) => {
                if (err) reject(err);
                resolve();
              }
            );
          });
        }
      }
    });
  }

  async read(id: string): Promise<Purchase | null | undefined> {
    const purchase = await MySql.query(
      "select * from purchases where id = ?",
      id
    );

    const inventory = await MySql.query(
      "select * from inventories where purchaseId = ?",
      id
    );

    const payment = await MySql.query(
      "select * from payments where purchaseId = ?",
      id
    );

    if (purchase.length > 0) {
      return { ...purchase[0], inventory: inventory, payment: payment };
    }

    return null;
  }
}
