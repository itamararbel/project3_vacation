import express, { NextFunction, Request, Response } from "express";
import logic_users from "../logic/logic_users";
import { idNotFound } from "../modal/client_error";
import { authentication } from '../middleWere/authentication';
import { isAdmin } from '../middleWere/isAdmin';
import authLogic from "../logic/auth-logic";

const userController = express.Router();

userController.get("/all", [authentication,isAdmin], async (request:Request, response:Response, next:NextFunction) => {
    response.set("Authorization", await authLogic.relog(request.header("Authorization")));
    response.status(200).json(await logic_users.getAllUsers())
})



userController.get("/:id", authentication, async (request:Request, response:Response, next:NextFunction)=>{
    const id = +request.params.id;
    const resp = await logic_users.getById(id);
    response.set("Authorization", await authLogic.relog(request.header("Authorization")));
    resp.length === 0 ? next(new idNotFound(id)) : response.status(200).json(resp);
}
)

userController.delete("/:id",[authentication,isAdmin] ,async (request:Request, response:Response, next:NextFunction)=>{
    const id = +request.params.id;
    response.set("Authorization", await authLogic.relog(request.header("Authorization")));
    response.status(204).json(await logic_users.deleteUsers(id))
}
)

userController.post("/follow", authentication,async (request:Request, response:Response, next:NextFunction)=>{
    console.log("entering userController")
    const body = request.body;
    await logic_users.addFollow(body)
    response.set("Authorization", await authLogic.relog(request.header("Authorization").split(" ")[1]));
    response.status(200).json()
})

userController.delete("/follow/:vacation/:user",authentication ,async (request:Request, response:Response, next:NextFunction)=>{
    const vacation = +request.params.vacation;
    const user =  +request.params.user;
    response.set("Authorization", await authLogic.relog(request.header("Authorization").split(" ")[1]));
    response.status(204).json(await logic_users.deleteFollow(vacation , user))
})


export default userController;
