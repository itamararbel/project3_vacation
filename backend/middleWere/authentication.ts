import { client_error } from './../modal/client_error';
import { Request, Response, NextFunction } from "express";
import jwtHundler from "../util/jwtHundler";
import {appendFileSync} from "fs";
import logger from '../util/errorsLogger';

const authentication = async ( request: Request, response: Response, next:NextFunction)=>{
    const authorization = request.header("authorization"); 
    console.log(authorization.split(" ")[1])
try{
    const isValid=await jwtHundler.checkToken(authorization.split(" ")[1]);
    console.log("isValid")
    isValid?  next(): next(new client_error(401, "you haven't done nothing in a long time please log again "));
}catch(err){
    logger.error(err.message)
}
}

export { 
    authentication
}