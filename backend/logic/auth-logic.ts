import { NextFunction } from 'express';
import { OkPacket } from "mysql";
import config from "../config";
import dal from "../dal/dal";
import userModal, { credsModal, UserAuthentic, UserRole } from "../modal/userModal";
import { client_error } from "../modal/client_error";
import jwtHundler from "../util/jwtHundler";
import logger from "../util/errorsLogger";
import hash from "../util/crypto_helper";

const addNewUsers = async (newUser: userModal, next:NextFunction): Promise<string> => {
    // newUser.password = hash(newUser.password);
    const sql = `INSERT INTO users_table VALUES (default , '${newUser.first_name}', '${newUser.family_name}', '${newUser.user_name}', '${newUser.password}')`
    let result: OkPacket
    try {
        result = await dal.execute(sql);
    } catch (err) {
        logger.info( "user name exists: "+ newUser.user_name)   
        throw new client_error(403, "user name exists, plz choose another");
    }
    newUser.user_id = result.insertId;
    return jwtHundler.createToken(new UserAuthentic(newUser.user_name, newUser.user_id, "", 1));
}

const relog = async(header:string):Promise<string>=>{
    const payload : UserAuthentic = (jwtHundler.getUser(header)as any).user
    const newToken = jwtHundler.createToken(new UserAuthentic(payload.user_name,payload.user_id,"", payload.user_role))
    return newToken
}


const checkCredentials = async (user: credsModal): Promise<string> => {
    console.log("i am user" + user);
    // user.password = hash(user.password)

    if (user.password === config.adminPassword && user.user_name === config.adminUserName) {
        const userDetails =  new UserAuthentic(user.user_name, 0,"", 0)
        return await jwtHundler.createToken(userDetails)
    }
    
    const sql = `select user_id, user_name from users_table where user_name = '${user.user_name}' and password = '${user.password}'`;
    const userArr: userModal[] = await dal.execute(sql);
    if (userArr.length > 0) {
        const userDetails =  new UserAuthentic(userArr[0].user_name, userArr[0].user_id,"", 1)                
        return  await jwtHundler.createToken(userDetails);
    } else {
        throw new client_error(401, "user name and/or password are incorrect")
    }
}


export default {
    checkCredentials,
    addNewUsers,
    relog
}