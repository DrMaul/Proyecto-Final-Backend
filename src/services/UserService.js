import { UsuariosMongoDAO } from "../dao/UsuariosMongoDAO.js" 

class UserService{
    constructor(dao){
        this.userDAO = dao
    }

    async createUser(usuario) {
        return await this.userDAO.create(usuario)
    }

    async getUserBy(filtro) {
        return await this.userDAO.getBy(filtro)
    }

    async getUserByPopulate(filtro) {
        return await this.userDAO.getByPopulate(filtro) 
    }

    async updatePassword(id, newPassword) {
        return await this.userDAO.updatePassword(id, newPassword)
    }

    async updateRol(id, newRol){
        return await this.userDAO.updateRol(id, newRol)
    }

    async getUser(){
        return await this.userDAO.get()
    }

    async updateDocuments(id, newDocuments){
        return await this.userDAO.updateDocuments(id, newDocuments)
        
    }
    
}

export const userService = new UserService(new UsuariosMongoDAO())