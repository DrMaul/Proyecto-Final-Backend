export class UsuariosDTO {
    constructor(usuario){
        this.name = usuario.first_name.toUpperCase()
        this.email = usuario.email
        this.rol = "user"
        this.documents = usuario.documents
    }
}