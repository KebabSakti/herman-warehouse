import { randomUUID } from "crypto";
import dayjs from "dayjs";
import { Result } from "../../../common/type";
import { Invoice as InvoiceHelper } from "../../../helper/invoice";
import { MySql, pool } from "../../../helper/mysql";
import { Customer } from "../../customer/model/customer_model";
import { Product } from "../../product/model/product_type";
import { Supplier } from "../../supplier/model/supplier_model";
import { InvoiceApi } from "./invoice_api";
import { Invoice, Item } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";

export class InvoiceMysql implements InvoiceApi {
  async list(param: InvoiceList): Promise<Result<Invoice[]>> {
    let table = `select * from invoices where deleted is null`;

    if (param.search != null) {
      const search = pool.escape(param.search);
      table += ` and (customerName like "%"${search}"%" or customerPhone like "%"${search}"%" or code like "%"${search}"%")`;
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
    select invoices.*, items.*, installments.*
    from (${table}) as invoices
    left join invoices on invoices.id = items.invoiceId
    left join installments on invoices.id = items.invoiceId
    `;

    const invoices = await MySql.query({ sql: query, nestTables: true });
    const result = invoices.reduce((a: any, b: any) => {
      const invoice = a.find((c: any) => c.id == b.invoices.id);

      if (invoice == undefined) {
        const item = { ...b.invoices, item: [], installment: [] };

        if (b.items.invoiceId == item.id) {
          item.item.push(b.items);
        }

        if (b.installments.invoiceId == item.id) {
          item.installment.push(b.installments);
        }

        a.push(item);
      } else {
        const invItem = invoice.item.find((c: any) => c.id == b.items.id);

        const installment = invoices.installment.find(
          (c: any) => c.id == b.installments.id
        );

        if (invItem == undefined) {
          invoice.item.push(b.items);
        }

        if (installment == undefined) {
          invoice.installment.push(b.installments);
        }
      }

      return a;
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

  async create(param: InvoiceCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      const customer = await new Promise<Customer>((resolve, reject) => {
        connection.query(
          "select * from customers where id = ?",
          param.customerId,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res[0]);
          }
        );
      });
      const invoiceId = param.id;
      const today = new Date();
      const itemTotal = param.item.reduce((a, b) => a + b.qty * b.price, 0);
      const installmentTotal =
        param.installment == null ? 0 : param.installment.amount;
      const total = itemTotal - installmentTotal;

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into invoices set ?",
          {
            id: invoiceId,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            customerAddress: customer.address,
            code: InvoiceHelper.customer(),
            note: param.note,
            total: total,
            created: today,
            updated: today,
          },
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      for await (let item of param.item) {
        const supplier = await new Promise<Supplier>((resolve, reject) => {
          connection.query(
            "select * from suppliers where id = ?",
            [item.supplierId],
            (err, res) => {
              if (err) reject(err);
              if (res.length == 0) reject(err);
              resolve(res[0]);
            }
          );
        });
        const product = await new Promise<Product>((resolve, reject) => {
          connection.query(
            "select * from products where id = ?",
            [item.productId],
            (err, res) => {
              if (err) reject(err);
              if (res.length == 0) reject(err);
              resolve(res[0]);
            }
          );
        });
        const itemTotal = item.qty * item.price;

        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into items set ?",
            {
              id: randomUUID(),
              invoiceId: invoiceId,
              stockId: item.stockId,
              productId: product.id,
              productCode: product.code,
              productName: product.name,
              productNote: product.note,
              supplierId: supplier.id,
              supplierName: supplier.name,
              supplierPhone: supplier.phone,
              qty: item.qty,
              price: item.price,
              total: itemTotal,
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
            "update stocks set qty = qty - ? where supplierId = ? and productId = ? and price = ?",
            [item.qty, supplier.id, product.id, item.price],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update customers set outstanding = outstanding + ? where id = ?",
          [total, customer.id],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      if (param.installment != null) {
        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into installments set ?",
            {
              id: randomUUID(),
              invoiceId: invoiceId,
              amount: param.installment!.amount,
              attachment: param.installment!.attachment,
              note: param.installment!.note,
              outstanding: total,
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
    });
  }

  async read(id: string): Promise<Invoice | null | undefined> {
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

  async remove(id: string): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = new Date();
      const invoice = await new Promise<Invoice>((resolve, reject) => {
        connection.query(
          "select * from invoices where id = ?",
          id,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res);
          }
        );
      });

      const items = await new Promise<Item[]>((resolve, reject) => {
        connection.query(
          "select * from items where invoiceId = ?",
          id,
          (err, res) => {
            if (err) reject(err);
            if (res.length == 0) reject(err);
            resolve(res);
          }
        );
      });

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update customer set outstanding = outstanding - ?, updated = ? where id = ?",
          [invoice!.total, today, invoice!.customerId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      for await (let item of items) {
        await new Promise<void>((resolve, reject) => {
          connection.query(
            "update stocks set qty = qty - ? where supplierId = ? and productId = ? and price = ?",
            [item.qty, item.supplierId, item.productId, item.price],
            (err) => {
              if (err) reject(err);
              resolve();
            }
          );
        });
      }

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "update invoices set deleted = ? where id = ?",
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
