import { userService } from '../services/UserService.js';
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";


export class UserController {
    static cambiarRol = async (req,res, next)=> {
        
        try {

            let id = req.params.id
            let user = await userService.getUserBy({_id:id})

            if (!user) {
                return CustomError.createError("Error", null, `Usuario con id ${id} no encontrado`, TIPOS_ERROR.NOT_FOUND)
            }


            let documentosRequeridos = ["identificacion","compDomicilio","compEstadoCuenta"]


            let documentosUsuario = user.documents ? user.documents.map((document) => document.name.split("-")[0]) : [];

            let tieneTodosLosDocumentos = documentosRequeridos.every((document) => documentosUsuario.includes(document));

            if(!tieneTodosLosDocumentos){
                return CustomError.createError("Error", null,`Faltan documentos necesarios para actualizar a Premium`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }

            let nuevoRol
            if(user.rol.toLowerCase()==="user"){
                nuevoRol = "premium"
            }
            else if(user.rol.toLowerCase()==="premium"){
                nuevoRol = "user"
            }
            else if(user.rol.toLowerCase()==="admin"){
                return CustomError.createError("Error", null,`No se puede actualizar el rol de Admin`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }

            if (nuevoRol) {
                await userService.updateRol(user._id, nuevoRol);
                res.setHeader('Content-type', 'application/json');
                return res.status(200).json({ payload: `El usuario ${user.email} actualizó su rol a ${nuevoRol}` });
            } else {
                return CustomError.createError("Error", null, "Rol no válido para actualización", TIPOS_ERROR.ARGUMENTOS_INVALIDOS);
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

    static getRol = async (req,res, next)=> {
        
        try {
            
            let id = req.params.id
            let user = await userService.getUserBy({_id:id})
            if (!user) {
                return CustomError.createError("Error", null, `Usuario con id ${id} no encontrado`, TIPOS_ERROR.NOT_FOUND);
            }
            
            
            res.setHeader('Content-type', 'application/json')
            res.status(200).json({payload: `El usuario ${user.first_name} tiene el rol ${user.rol}`})
        
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static getUsuarios = async (req,res, next)=> {

        try {
            let usuarios = await userService.getUser()
            if(!usuarios){
                // return CustomError.createError("Error", null,`Error al obtener usuarios`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                return CustomError.createError("Error", null, `No se encontraron usuarios`, TIPOS_ERROR.NOT_FOUND)
            }
    
            let usuariosFiltrados = usuarios.map(usuario => ({
                _id: usuario._id,
                first_name: usuario.first_name,
                email: usuario.email,
                rol: usuario.rol
            }));
    
    
            res.setHeader('Content-type', 'application/json')
            return res.status(200).json({usuariosFiltrados})
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }

    }

    static uploadDocuments = async (req,res,next)=>{

        try {
            let id = req.params.id
            if(!req.files){
                return CustomError.createError("Error", null,`Error archivos faltantes`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
    
            let documentos = []
            let files = ["product","profile","document"]
    
            files.forEach(file=>{
                if(req.files[file]){
                    documentos.push({name:file.filename, reference:file.path})
                }
            })
    
            let user = await userService.getUserBy({_id:id})
            if(!user){
                return CustomError.createError("Error", null,`Error al obtener usuarios`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
    
            await userService.updateDocuments(user._id, documentos) 
            res.setHeader('Content-type', 'application/json')
            return res.status(200).json({payload: `El usuario ${user.first_name} ha actualizado sus documentos`, documents: user.documents})
            
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
