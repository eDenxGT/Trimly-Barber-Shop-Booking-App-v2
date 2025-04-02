import { createLogger, format, transports } from "winston";
import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname,"../../../logs");
if(!fs.existsSync(logDir)){
    fs.mkdirSync(logDir, {recursive: true});
}

const logger = createLogger({
    level: "error",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({filename: path.join(logDir, "error.log")})
    ]
})

export default logger;