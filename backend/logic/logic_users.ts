import { appendFileSync } from 'fs';

import { followModal, UserAuthentic } from './../modal/userModal';
import dal from "../dal/dal"
import userModal  from "../modal/userModal"
import jwtHundler from '../util/jwtHundler';


const getAllUsers = async():Promise<userModal[]>=>{
const sql = "select * from users_Table"
return await dal.execute(sql)
}

const getById = async(id:number):Promise<userModal[]>=>{
    const sql = "select * from users_Table WHERE user_id ="+id;
    return await dal.execute(sql)
}

const deleteUsers = async(id:number):Promise<void>=>{
    const sql = "delete from users_Table where user_id="+id;
    return await dal.execute(sql);
}

const addFollow = async(follow:followModal):Promise<string>=>{
    console.log("entering addFollow")
    const sql = `insert into follow_table VALUES (${follow.user_id}, ${follow.vacation_id})`
    try{
    dal.execute(sql);
    console.log("sql")
}catch(err){
    console.log(err);
    appendFileSync("errorsLog.txt", err.message,"utf-8");   
}
    return jwtHundler.createToken(new UserAuthentic(follow.user_name, follow.user_id,"" ,follow.user_role))
}

const deleteFollow = async(vacation:number , user:number):Promise<string>=>{
const sql = `delete from follow_table where user_id = ${user} and vacation_id = ${vacation}`
return dal.execute(sql);
}


export default {
    getAllUsers,
    getById,
    deleteUsers,
    addFollow,
    deleteFollow
}