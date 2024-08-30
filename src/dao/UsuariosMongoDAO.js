import { usuariosModelo } from "./models/usuarios.modelo.js";

export class UsuariosMongoDAO{

    async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro={}){
        return await usuariosModelo.findOne(filtro).lean()
    }

    async getByPopulate(filtro={}){
        return await usuariosModelo.findOne(filtro).populate("cart").lean()
    }

    async updatePassword(id, newPassword){
        return await usuariosModelo.findByIdAndUpdate({_id: id}, {$set: {password: newPassword}}, {runValidators: true, returnDocument: "after"})
        
    }

    async updateRol(id, newRol){
        return await usuariosModelo.findByIdAndUpdate({_id: id}, {$set: {rol: newRol}}, {runValidators: true, returnDocument: "after"})
        
    }

    async get(){
        return await usuariosModelo.find().lean()
    }

    async updateDocuments(id, newDocuments){
        return await usuariosModelo.findByIdAndUpdate({_id: id}, {$set: {documents: newDocuments}}, {runValidators: true, returnDocument: "after"})
        
    }

}