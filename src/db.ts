//  import { DatabaseClient } from '/opt/nodejs/falcon-runtime'
//  import { FieldPacket, RowDataPacket } from 'mysql2'
// // export class DatabaseClientWrapper {
// //   public dbclient: any

// //   constructor() {
// //     this.dbclient = new DatabaseClient()
// //   }

// //   private async resetDB(read?: Boolean) {
// //     this.dbclient = new DatabaseClient()
// //     let newConnection = read
// //       ? await this.dbclient.getReaderConnection()
// //       : await this.dbclient.getWriterConnection()
// //     return newConnection
// //   }

// //   query(query: string, param: (string | number | string[])[], read?: Boolean) {
// //     return new Promise(async (resolve, reject) => {
// //       let connection
// //       try {
// //         connection = read
// //           ? await this.dbclient.getReaderConnection()
// //           : await this.dbclient.getWriterConnection()

// //         let result = await connection.query(query, param)
// //         connection.release()
// //         return resolve(result)
// //       } catch (err: any) {
// //         console.error(err)
// //         if (
// //           err &&
// //           (/^PROTOCOL_ENQUEUE_AFTER_/.test(err.code) ||
// //             err.code === 'PROTOCOL_CONNECTION_LOST' ||
// //             err.code === 'EPIPE' ||
// //             err.code === 'ECONNRESET')
// //         ) {
// //           connection?.destroy()
// //           let newConnection = await this.resetDB(read)
// //           let result = await newConnection.query(query, param)
// //           newConnection.release()
// //           return resolve(result)
// //         }
// //         reject(err)
// //       }
// //     })
// //   }

// //   async getReaderConnection() {
// //     return Promise.resolve({
// //       query: this.query,
// //     })
// //   }

// //   async getWriterConnection() {
// //     return Promise.resolve({
// //       query: this.query,
// //     })
// //   }

// //   async getTransactionConn() {
// //     return this.dbclient.getWriterConnection()
// //   }
// // }

// export interface FieldNewPacket extends RowDataPacket {
//   [key: string]: any;
// }

// export const databaseExecuteQuery = async <T extends FieldNewPacket>(
//   sql: string,
//   param: (string | number | string[])[],
//   read: boolean = true
// ): Promise<[T[], FieldPacket[]]> => {
//   let connection = read
//     ? await new DatabaseClient().getReaderConnection()
//     : await new DatabaseClient().getWriterConnection();
//   try {
//     let result = await connection.query<T[]>(sql, param);
//     return result;
//   } catch (err: any) {
//     console.error(err);
//     if (
//       err &&
//       (/^PROTOCOL_ENQUEUE_AFTER_/.test(err.code) ||
//         err.code === "PROTOCOL_CONNECTION_LOST" ||
//         err.code === "EPIPE" ||
//         err.code === "ECONNRESET")
//     ) {
//       connection?.destroy();
//       let newConnection = read
//         ? await new DatabaseClient().getReaderConnection()
//         : await new DatabaseClient().getWriterConnection();

//       let result = await newConnection.query<T[]>(sql, param);
//       newConnection.release();
//       return result;
//     }
//     throw err;
//   } finally {
//     connection.release();
//   }
// };
