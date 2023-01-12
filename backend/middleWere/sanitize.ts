import { Request, Response, NextFunction } from "express";
import stripTag from "striptags"

export default function sanitize ( request: Request, response: Response, next:NextFunction):void{
    for (const props in request.body){
   typeof request.body[props] === "string"  && stripTag(request.body[props])
 }
    next()
}


