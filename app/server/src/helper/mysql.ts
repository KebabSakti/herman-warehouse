import mysql from "mysql";

type TransactionCallback<T> = (connection: mysql.PoolConnection) => Promise<T>;

export const pool = mysql.createPool({
  connectionLimit: 10,
  timezone: "Z",
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,
});

export class MySql {
  static async query(
    query: string | mysql.QueryOptions,
    values?: any | undefined
  ): Promise<any> {
    return await new Promise((resolve, reject) => {
      pool.query(query, values, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  static async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    const connection = await new Promise<mysql.PoolConnection>(
      (resolve, reject) => {
        pool.getConnection((err, conn) => {
          if (err) reject(err);
          else resolve(conn);
        });
      }
    );

    try {
      // Start the transaction
      await new Promise<void>((resolve, reject) => {
        connection.beginTransaction((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Execute the callback with the connection in transaction mode
      const result = await callback(connection);

      // Commit the transaction
      await new Promise<void>((resolve, reject) => {
        connection.commit((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return result; // Return result if transaction was successful
    } catch (error) {
      // Rollback in case of error
      await new Promise<void>((resolve) => {
        connection.rollback(() => resolve());
      });
      throw error;
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  }
}
