import {createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "debug",
    transports:[
                new transports.Console(),
                new transports.File({filename: "./e_logger.txt"})
    ],
    format: format.combine(
        format.timestamp(),
        format.printf(log=> `${log.level}\t${log.timestamp}\t${log.message}`)
    )

})
export default logger