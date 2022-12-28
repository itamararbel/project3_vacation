import express, { NextFunction, Request, Response } from "express";
import authLogic from "../logic/auth-logic";
import jwtHundler from "../util/jwtHundler";
import { appendFileSync } from "fs";

const authController = express.Router();


authController.post("/log", async (request: Request, response: Response, next: NextFunction) => {
    const userCreds = (request.body);
    try {
        const token = await authLogic.checkCredentials(userCreds);
        console.log(token)
        // response.set("Access-Control-Expose-Headers: Authorization ")
        response.set('Authorization',`Bearer ${token}`);
        response.status(200).send("fre");
    }catch(err){
        console.log(err.massage);
        appendFileSync("errorsLog.txt", err.massage,"utf-8");   
        next(err)
    }

    }    
)

authController.post("/checkIsLog", async (request: Request, response: Response, next: NextFunction) => {
    const authorization = await request.header("authorization").split(" ")[1]; 
    console.log("authorization", authorization)
    if(jwtHundler.checkToken(authorization)){
        try {
            console.log("checked")
            response.set("authorization", "Bearer "+await authLogic.relog(authorization));
            response.status(204).json();
        }catch(err){
            appendFileSync("errorsLog.txt", err.massage,"utf-8");   
            next(err)
        }    
    } else {
        response.status(400).json("token is expired plz log in")
    }
    }    
)

authController.post("/add", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    let resp: string;
    try {
        resp = await authLogic.addNewUsers(body)
    }
    catch (error) {
        appendFileSync("errorsLog.txt", error.massage,"utf-8");   
        next(error);
    }
    response.set("authorization", resp)
    response.status(201)
}
)

export default authController;