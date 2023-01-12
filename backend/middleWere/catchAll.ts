import { Response } from "express";

const catchAll = (err: any, response: Response)=>{
    console.log(err)
    const statusCode = err? err.status : 500; 
    response.status(statusCode).send(err.massage);
}

export { 
    catchAll
}