import cors from "cors";
import express from "express";
import config from "./config";
import vacationController from "./controllers/vacation_controller";
import pageNotFound from "./middleWere/pageNotFound";
import sqlInit from "./util/init_sql";
import { catchAll } from './middleWere/catchAll';
import userController from "./controllers/userController";
import fileUpload from "express-fileupload";
import authController from "./controllers/authController";



const server = express();
sqlInit();
server.use(fileUpload({
    createParentPath:true
}));
const corsOptions = {exposedHeaders: "authorization"}
server.use(express.static('./src/assets/'))
server.use(cors(corsOptions));
server.use(express.json());
server.use("/api/auth", authController)
server.use("/api/users" , userController);
server.use("/api/vacations", vacationController );
server.use("*",pageNotFound);
server.use(catchAll)
server.listen(config.port, ()=>{console.log("listening on port"+ config.port)})
