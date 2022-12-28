import { Request, Response, NextFunction } from "express";

const catchAll = (err: any, request: Request, response: Response, next:NextFunction)=>{
    console.log(err)
    const statusCode = err? err.status : 500; 
    response.status(statusCode).send("<h1>"+err.massage+"</h1>");
}

export { 
    catchAll
}