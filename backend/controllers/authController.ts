import express, { NextFunction, Request, Response } from "express";
import authLogic from "../logic/auth-logic";
import jwtHundler from "../util/jwtHundler";
import logger from "../util/errorsLogger";
import { authentication } from "../middleWere/authentication";

const authController = express.Router();

authController.get("/test", async (request: Request, response: Response, next: NextFunction) => { 
    response.status(200).json("test is working")
})

authController.post("/log", async (request: Request, response: Response, next: NextFunction) => {
    const userCreds = (request.body);
    try {
        const token = await authLogic.checkCredentials(userCreds);
        response.set('Authorization',`Bearer ${token}`);
        response.status(200).send("welcome");
    }catch(err){
       logger.error(err.message)   
        next(err)
    }

    }    
)
authController.post("/checkIsLog", authentication ,async (request: Request, response: Response, next: NextFunction) => {
    const authorization = await request.header("authorization").split(" ")[1]; 
    if(jwtHundler.checkToken(authorization)){
        try {
            response.set("authorization", "Bearer "+await authLogic.relog(authorization));
            response.status(204).json();
        }catch(err){
            logger.error(err.message);
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
        resp = await authLogic.addNewUsers(body,next)
        response.set("authorization", resp)
     response.status(201).json(resp)
    }
    catch (err) {
        logger.error(err.message)   
        next(err);
    }
}
)

export default authController;