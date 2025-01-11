import dayjs from "dayjs";
import { Result } from "../../../common/type";
import { MySql, pool } from "../../../helper/mysql";
import { InvoiceApi } from "./invoice_api";
import { Invoice } from "./invoice_model";
import { InvoiceCreate, InvoiceList } from "./invoice_type";
import { BadRequest } from "../../../common/error";
import { Item } from "./item_model";

export class InvoiceMysql implements InvoiceApi {
  async list(param: InvoiceList): Promise<Result<Invoice[]>> {
    let table = `select * from invoices where deleted is null`;

    if (param.search != null) {
      const search = pool.escape(param.search);
      table += ` and (customerName like "%"${search}"%" or customerPhone like "%"${search}"%" or code like "%"${search}"%")`;
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

    const offset = (param.page - 1) * param.limit;
    const limit = param.limit;
    table += ` order by created desc limit ${limit} offset ${offset}`;

    let query = `
    select invoices.*, items.*, installments.*
    from (${table}) as invoices
    left join items on invoices.id = items.invoiceId
    left join installments on invoices.id = installments.invoiceId
    `;

    query += ` order by invoices.created desc`;
    const invoices = await MySql.query({ sql: query, nestTables: true });

    const result = invoices.reduce((acc: any[], current: any) => {
      // Find the index of the current invoice in the accumulated result
      const index = acc.findIndex((inv: any) => inv.id === current.invoices.id);

      if (index === -1) {
        // Create a new invoice entry if it doesn't exist
        const invoice = {
          ...current.invoices,
          item: [],
          installment: [],
        };

        // Add items if invoiceId matches
        if (current.items && current.items.invoiceId === current.invoices.id) {
          invoice.item.push(current.items);
        }

        // Add installments if invoiceId matches
        if (
          current.installments &&
          current.installments.invoiceId === current.invoices.id
        ) {
          if (current.installments.id) {
            invoice.installment.push(current.installments);
          }
        }

        acc.push(invoice);
      } else {
        // Get the existing invoice from the accumulated result
        const invoice = acc[index];

        // Add items if not already present and invoiceId matches
        if (current.items && current.items.invoiceId === invoice.id) {
          const existingItem = invoice.item.find(
            (it: any) => it.id === current.items.id
          );
          if (!existingItem) {
            invoice.item.push(current.items);
          }
        }

        // Add installments if not already present and invoiceId matches
        if (
          current.installments &&
          current.installments.invoiceId === invoice.id
        ) {
          const existingInstallment = invoice.installment.find(
            (inst: any) => inst.id === current.installments.id
          );
          if (!existingInstallment) {
            invoice.installment.push(current.installments);
          }
        }
      }

      return acc;
    }, []);

    const total =
      param.search || (param.start && param.end)
        ? result.length
        : (
            await MySql.query(
              "select count(*) as total from invoices where deleted is null"
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

  async create(param: InvoiceCreate): Promise<void> {
    await MySql.transaction(async (connection) => {
      const today = new Date();

      await new Promise<void>((resolve, reject) => {
        connection.query(
          "insert into invoices set ?",
          {
            id: param.id,
            customerId: param.customerId,
            customerName: param.customerName,
            customerPhone: param.customerPhone,
            customerAddress: param.customerAddress,
            code: param.code,
            note: param.note,
            totalItem: param.totalItem,
            totalPaid: param.totalPaid,
            total: param.total,
            outstanding: param.outstanding,
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

      for await (let item of param.item) {
        await new Promise<void>((resolve, reject) => {
          connection.query(
            "insert into items set ?",
            {
              id: item.id,
              invoiceId: param.id,
              stockId: item.stockId,
              productId: item.productCode,
              productCode: item.productCode,
              productName: item.productName,
              productNote: item.productNote,
              supplierId: item.supplierId,
              supplierName: item.supplierName,
              supplierPhone: item.supplierPhone,
              qty: item.qty,
              price: item.price,
              total: item.total,
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
          "update customers set outstanding = outstanding + ? where id = ?",
          [param.total, param.customerId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });

      if (param.installment != null) {
        for await (const installment of param.installment) {
          await new Promise<void>((resolve, reject) => {
            connection.query(
              "insert into installments set ?",
              {
                id: installment.id,
                invoiceId: param.id,
                amount: installment.amount,
                attachment: installment.attachment,
                note: installment.note,
                outstanding: param.total,
                printed: param.printed,
                dp: installment.dp,
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

  async read(id: string): Promise<Invoice | null | undefined> {
    const query = `
        select invoices.*, items.*, installments.*
        from invoices
        left join items on invoices.id = items.invoiceId
        left join installments on invoices.id = items.invoiceId
        where invoices.deleted is null
        and invoices.id = ${pool.escape(id)}`;

    const invoices = await MySql.query({ sql: query, nestTables: true });

    const result = invoices.reduce((acc: any[], current: any) => {
      // Find the index of the current invoice in the accumulated result
      const index = acc.findIndex((inv: any) => inv.id === current.invoices.id);

      if (index === -1) {
        // Create a new invoice entry if it doesn't exist
        const invoice = {
          ...current.invoices,
          item: [],
          installment: [],
        };

        // Add items if invoiceId matches
        if (current.items && current.items.invoiceId === current.invoices.id) {
          invoice.item.push(current.items);
        }

        // Add installments if invoiceId matches
        if (
          current.installments &&
          current.installments.invoiceId === current.invoices.id
        ) {
          if (current.installments) {
            invoice.installment.push(current.installments);
          }
        }

        acc.push(invoice);
      } else {
        // Get the existing invoice from the accumulated result
        const invoice = acc[index];

        // Add items if not already present and invoiceId matches
        if (current.items && current.items.invoiceId === invoice.id) {
          const existingItem = invoice.item.find(
            (it: any) => it.id === current.items.id
          );
          if (!existingItem) {
            invoice.item.push(current.items);
          }
        }

        // Add installments if not already present and invoiceId matches
        if (
          current.installments &&
          current.installments.invoiceId === invoice.id
        ) {
          const existingInstallment = invoice.installment.find(
            (inst: any) => inst.id === current.installments.id
          );
          if (!existingInstallment) {
            invoice.installment.push(current.installments);
          }
        }
      }

      return acc;
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

      if (!invoice) {
        throw new BadRequest();
      }

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
          "update customers set outstanding = outstanding - ?, updated = ? where id = ?",
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
            "update stocks set qty = qty - ? where id = ?",
            [item.qty, item.stockId],
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
