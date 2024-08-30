export class UsuariosDTO {
    constructor(usuario){
        this.name = usuario.nombre.toUpperCase()
        this.email = usuario.email
        this.rol = "user"
    }
}