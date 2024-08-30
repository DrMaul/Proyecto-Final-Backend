import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import winston from 'winston'
import { config } from './config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;


const SECRET="CoderCoder123"
export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword= (password, passwordEncriptada) => bcrypt.compareSync(password, passwordEncriptada)

export const mongourl = "mongodb+srv://agusfmartinez:CoderCoder@cluster0.zvgrerx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce"

let customLevels = {
    fatal:0,
    error:1,
    warning:2,
    info:3,
    http:4,
    debug:5
}

const transporteConsola = new winston.transports.Console(
    {
        level:"debug",
        format: winston.format.combine(
            winston.format.colorize({
                colors:{fatal: "bold white redBG", error:"red", warning:"yellow", info:"black whiteBG", http:"blue", debug:"green"}
            }),
            winston.format.simple(),
        )
    }
)

export const logger = winston.createLogger(
    {
        levels: customLevels,
        transports: [
            new winston.transports.File(
                {
                    level:"error",
                    filename:"./src/logs/errors.log",
                    format: winston.format.combine(
                        winston.format.timestamp(),
                    )
                }
            )
        ]
    }
)

if (config.MODE === "DEV"){
    logger.add(transporteConsola)
}

export const middLogger = (req,res,next) => {
    req.logger = logger
    next()
}