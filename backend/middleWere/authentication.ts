import { client_error } from './../modal/client_error';
import { Request, Response, NextFunction } from "express";
import jwtHundler from "../util/jwtHundler";
import {appendFileSync} from "fs";

const authentication = async ( request: Request, response: Response, next:NextFunction)=>{
    const authorization = request.header("authorization"); 
    console.log(authorization.split(" ")[1])
try{
    const isValid=await jwtHundler.checkToken(authorization.split(" ")[1]);
    console.log(isValid)
    isValid?  next(): next(new client_error(401, "i don't now who you are and where you have been"));
}catch(err){
    appendFileSync("errorsLog.txt", err.message,"utf-8");   
}
}

export { 
    authentication
}