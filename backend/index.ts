import cors from "cors";
import expressRateLimit from "express-rate-limit";
import express from "express";
import config from "./config";
import vacationController from "./controllers/vacation_controller";
import pageNotFound from "./middleWere/pageNotFound";
import { catchAll } from './middleWere/catchAll';
import userController from "./controllers/userController";
import fileUpload from "express-fileupload";
import authController from "./controllers/authController";
import sanitize from "./middleWere/sanitize";
import sqlInit from "./util/init_sql";


const server = express();
sqlInit();
server.use(fileUpload({
    createParentPath: true
}));
const corsOptions = {
    origin: ['http://localhost:3000',"https://astounding-semifreddo-7612a4.netlify.app/"],
    exposedHeaders: "authorization"
}
server.use(cors(corsOptions));
server.use(express.static('./src/assets/'))
server.use(expressRateLimit({ windowMs: 1000, max: 5, message: "plz wait a while..." }))
server.use(sanitize);
server.use(express.json());
server.use("/api/auth", authController)
server.use("/api/users", userController);
server.use("/api/vacations", vacationController);
server.use("*", pageNotFound);
server.use(catchAll)
server.listen(config.port, () => { console.log("listening on port" + config.port) })

