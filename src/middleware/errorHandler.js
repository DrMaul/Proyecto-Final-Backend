import { TIPOS_ERROR } from "../utils/EErrors.js";

export const errorHandler = (error, req,res,next)=> {

    switch (error.code) {
        case TIPOS_ERROR.AUTENTICACION || TIPOS_ERROR.AUTORIZACION:
            res.setHeader('Content-Type','application/json');
            return res.status(401).json({error:`Credenciales incorrectas`})
            break;
        case TIPOS_ERROR.ARGUMENTOS_INVALIDOS:
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`${error.message}`})
            break;
        case TIPOS_ERROR.NOT_FOUND:
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:`${error.message}`})
            break;
    
        default:
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado - Contacte al administrador`})
            break;
    }

}