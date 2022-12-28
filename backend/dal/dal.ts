import mysql from 'mysql';
import config from '../config'
import { appendFileSync } from 'fs';

const connection = mysql.createPool({
host: config.mySqlHost,
user: config.mySqlUser,
database : config.mySqlDatabase,
password : config.mySqlPassword
})

const execute = (sql:string ): Promise<any> =>{
    return new Promise<any>((resolve, reject) => {
         connection.query(sql, (err, result) =>{
            if (err){
                appendFileSync("errorsLog.txt", err.message,"utf-8");   
                reject(err);
                return 
            }
            resolve(result)
         })
    })
}
export default {
    execute,
}
