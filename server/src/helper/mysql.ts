import mysql from "mysql";

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

export class MySql {
  static async query(query: string, values?: any | undefined): Promise<any> {
    return await new Promise((resolve, reject) => {
      pool.query(query, values, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  static async connect(query: string, values?: any | undefined): Promise<any> {
    return await new Promise((resolve, reject) => {
      pool.getConnection((connectionError, connection) => {
        if (connectionError) reject(connectionError);

        connection.query(query, values, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      });
    });
  }

  static async transaction(callback: Function): Promise<any> {
    return await new Promise((resolve, reject) => {
      pool.getConnection((connectionError, connection) => {
        if (connectionError) reject(connectionError);

        connection.beginTransaction((transactionError) => {
          if (transactionError) reject(transactionError);

          try {
            connection.commit(callback());
            resolve(callback());
          } catch (error) {
            connection.rollback();
            reject(error);
          }
        });
      });
    });
  }
}
