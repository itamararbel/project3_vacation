import express, { NextFunction, Request, Response } from "express";
import logic_vacation from "../logic/logic_vacation";
import { idNotFound } from "../modal/client_error";
import { authentication } from "../middleWere/authentication";
import { isAdmin } from "../middleWere/isAdmin";
import authLogic from "../logic/auth-logic";

const vacationController = express.Router();

vacationController.get("/all/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id
    response.status(200).json(await logic_vacation.getAllVacations(id))
})

vacationController.get("/id/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    const resp = await logic_vacation.getById(id);
    resp.length === 0 ? next(new idNotFound(id)) : response.status(200).json(resp);
}
)

vacationController.post("/add", [authentication,isAdmin],async (request: Request, response: Response, next: NextFunction) => {
    const newVacation = request.body;
    newVacation.image = request.files.pic;
    response.status(201).json(logic_vacation.addNewVacation(newVacation));
}
)

vacationController.delete("/:id", [authentication,isAdmin],async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    response.status(204).json(await logic_vacation.deleteVacation(id))
}
)

vacationController.put("/edit", [authentication,isAdmin],async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    console.log("i am in")
    if (request.files) {
        body.image = request.files.pic;
    }
    console.log("set")
    console.log("controler " +request.header("Authorization").split(" ")[1])

    response.set("Authorization", await authLogic.relog(request.header("Authorization").split(" ")[1]));
    response.status(201).json(await logic_vacation.editVacation(body))
}
)

vacationController.get("/followStatistics", [authentication,isAdmin],async (request: Request, response: Response, next: NextFunction) => {
    console.log("controller")
    response.status(200).json(await logic_vacation.getFollowStatistics())
})

export default vacationController;
