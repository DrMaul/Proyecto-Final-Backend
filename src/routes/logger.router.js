import { Router } from 'express';
export const router=Router()

router.get('/',(req,res)=>{

    req.logger.fatal("Error fatal")
    req.logger.error("Error log")
    req.logger.warning("Warning log")
    req.logger.info("Info log")
    req.logger.http("HTTP log")
    req.logger.debug("Debug log")

    res.setHeader('Content-Type','application/json')
    return res.status(200).json("Logger OK")
})