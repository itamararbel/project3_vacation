import { client_error } from './../modal/client_error';
import { Request, Response, NextFunction } from "express";
import jwtHundler from "../util/jwtHundler";
import config from '../config';

const isAdmin = async ( request: Request, response: Response, next:NextFunction)=>{
    const authorization = request.header("authorization").split(" ")[1]; 
     const user :any=await jwtHundler.getUser(authorization);
     user.user.user_name===config.adminUserName ?  next(): next(new client_error(403, "you are not authorized"));
}

export { 
    isAdmin
}