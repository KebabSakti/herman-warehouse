import { randomUUID } from "crypto";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { Product } from "../../product/product_type";
import {
  Purchase,
  PurchaseCreateParam,
  PurchaseListParam,
} from "../model/purchase_type";
import { Supplier } from "../model/supplier_type";

export class PurchaseService {
  async purchaseList(param: PurchaseListParam): Promise<Result<Purchase[]>> {
    let query = "select * from purchases where deleted is null";

    if (param.search != null) {
      const search = pool.escape(param.search);
      query += ` and (supplierName like "%"${search}"%" or supplierPhone like "%"${search}"%" or code like "%"${search}"%")`;
    }

    if (param.search?.length == 0) {
      const start = pool.escape(`${param.start} 00:00:00`);
      const end = pool.escape(`${param.end} 23:59:59`);
      query += ` and created between ${start} and ${end}`;
    }

    const total = (await MySql.query(query)).length;
    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    query += ` order by created desc limit ${limit} offset ${offset}`;
    const purchases = await MySql.query(query);
    const result: any = [];

    for await (let purchase of purchases) {
      const inventory = await MySql.query(
        "select * from inventories where purchaseId = ?",
        purchase.id
      );

      const payment = await MySql.query(
        "select * from payments where purchaseId = ?",
        purchase.id
      );

      result.push({ ...purchase, inventory: inventory, payment: payment });
    }

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

  async purchaseCreate(param: PurchaseCreateParam): Promise<void> {
    await MySql.transaction(async (connection) => {
      const purchaseId = randomUUID();

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
          "insert into purchase set ?",
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
            created: new Date(),
            updated: new Date(),
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
              created: new Date(),
              updated: new Date(),
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
                created: new Date(),
                updated: new Date(),
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

  async purchaseRead(id: string): Promise<Result<Purchase> | null | undefined> {
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
      const data = {
        data: { ...purchase[0], inventory: inventory, payment: payment },
        paging: {
          page: 1,
          limit: 10,
          total: 1,
        },
      };

      return data;
    }

    return null;
  }
}
