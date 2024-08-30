import { UsuariosMongoDAO as UsuariosManager } from '../dao/UsuariosMongoDAO.js';
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";

const usuariosManager = new UsuariosManager()

export class UserController {
    static cambiarRol = async (req,res, next)=> {
        
        try {
            try {
                let id = req.params.id
                let user = await usuariosManager.getBy({_id:id})

                let documentos = ["identificacion","compDomicilio","compEstadoCuenta"]

                let userDocs = user.documents.map((document)=> document.name.split("-")[0])

                let coincidencia = documentos.every(document => userDocs.includes(document))

                if(!coincidencia){
                    return CustomError.createError("Error", null,`Faltan documentos necesarios para actualizar a Premium`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }

                console.log("Rol actual: ",user.rol)
                if(user.rol.toLowerCase()==="user"){
                    await usuariosManager.updateRol(user._id, "premium")
        
                }
                if(user.rol.toLowerCase()==="premium"){
                    await usuariosManager.updateRol(user._id, "user")        
                }
                if(user.rol.toLowerCase()==="admin"){
                    return CustomError.createError("Error", null,`No se puede actualizar el rol de Admin`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }
                res.setHeader('Content-type', 'application/json')
                res.status(200).json({payload: `El usuario ${user.nombre} actualizó su rol a ${user.rol}`})
            
        } catch (error) {
            return CustomError.createError("Error", null,"Error al actualizar el rol del usuario",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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
            try {
                let id = req.params.id
                let user = await usuariosManager.getBy({_id:id})
                if(user){
                    res.setHeader('Content-type', 'application/json')
                    res.status(200).json({payload: `El usuario ${user.nombre} tiene el rol ${user.rol}`})
        
                }
                
                
            
            
        } catch (error) {
            return CustomError.createError("Error", null,"Error al obtener el rol del usuario",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static getUsuarios = async (req,res, next)=> {
        let usuarios = await usuariosManager.get()

        
        if(!usuarios){
            return CustomError.createError("Error", null,`Error al obtener usuarios`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        let usuariosFiltrados = usuarios.map(usuario => ({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        }));


        res.setHeader('Content-type', 'application/json')
        res.status(200).json({usuariosFiltrados})
    }

    static uploadDocuments = async (req,res,next)=>{
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

        let user = await usuariosManager.getBy({_id:id})
        if(!user){
            return CustomError.createError("Error", null,`Error al obtener usuarios`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        await usuariosManager.updateDocuments(user._id, documentos) 
        res.setHeader('Content-type', 'application/json')
        res.status(200).json({payload: `El usuario ${user.nombre} actualiza sus documents`})
    }
}
