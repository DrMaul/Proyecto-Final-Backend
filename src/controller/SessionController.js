import { UsuariosDTO } from '../dto/UserDTO.js';
import { Session } from 'express-session';

export class SessionController {
    static registro = async (req,res, next)=> {
        
        try {

            const acceptsHtml = req.accepts('html');

            if (acceptsHtml) {
                res.redirect('/login');
            } else {
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({payload:"Registro exitoso"});
            }
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static login = async (req,res, next)=> {
        
        try {

            req.session.usuario = req.user

            const acceptsHtml = req.accepts('html');

            if (acceptsHtml) {
                res.redirect('/login');
            } else {
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({payload:"Login exitoso", usuario: req.user});
            }

            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static callbackGithub = async (req,res, next)=> {
        
        try {

            req.session.usuario = req.user

            const acceptsHtml = req.accepts('html');

            if (acceptsHtml) {
                res.redirect('/login');
            } else {
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({payload:"Login exitoso", usuario: req.user});
            }

            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static logout = async (req,res, next)=> {
        
        try {

            req.session.destroy(e=>{
                if(e){
                    res.setHeader('Content-Type','application/json');
                    return res.status(500).json(
                        {
                            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                            detalle:`${error.message}`
                        }
                    )
                    
                }
        
            })
        
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Logout exitoso"});
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static current = async (req,res, next)=> {
        
        try {

            console.log(req.session.usuario)
            const userDTO = new UsuariosDTO(req.session.usuario)
            res.json({userDTO});
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }
}