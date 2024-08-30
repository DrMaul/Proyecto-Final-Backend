import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { UsuariosMongoDAO as UsuariosManager} from '../dao/UsuariosMongoDAO.js'
import { CartMongoDAO as CartManager } from '../dao/CartMongoDAO.js'
import { generaHash, validaPassword } from '../utils.js'

const usuariosManager = new UsuariosManager()
const cartManager = new CartManager()

//paso 1
export const initPassport = () => {

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv23liPRCJzxkr5KfDmE",
                clientSecret:"0bad4a444de0170d99691529e038ca2493f0fcc6",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async(accessToken, refreshToken, profile, done)=> {
                try {
                    let email = profile._json.email
                    let nombre = profile._json.name
                    if(!email){
                        return done(null,false)
                    }

                    let usuario = await usuariosManager.getByPopulate({email})
                    if(!usuario){
                        let nuevoCarrito = await cartManager.createCart()
                        usuario = await usuariosManager.create(
                            {
                                nombre, email, profile, cart: nuevoCarrito._id 
                            }
                        )
                        usuario = await usuariosManager.getByPopulate({email})

                        
                    }
                    return done(null,usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "registro",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async(req, username, password, done) => {
                try {
                    let {nombre} = req.body

                    console.log("nombre: ",nombre)
                    console.log("email: ",username)
                    console.log("password: ",password)

                    let nombreRegex = /^[a-zA-Z\s\-']+$/
                    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    //let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
                    
                    //Validación del nombre
                    if (!nombre || typeof nombre !== 'string' || nombre.length < 2 || nombre.length > 40 || !nombreRegex.test(nombre)) {
                        return done(null, false);
                    }

                    let existe = await usuariosManager.getBy({email: username})
                    if(existe){
                        return done(null, false)
                    }

                    //Validación del email
                    if (!emailRegex.test(username)) {
                        return done(null, false);
                    }

                    //Validación de password
                    /* if (!passwordRegex.test(password)) {
                        console.log("Error al registrar la Password: La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un minimo de 8 caracteres")
                        return done(null, false);
                    } */

                    let nuevoCarrito = await cartManager.create()
                    password = generaHash(password)

                    let usuario = await usuariosManager.create({nombre, email:username, password, cart:nuevoCarrito._id})

                    return done(null, usuario)


                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField:"email"
            },
            async(username, password, done)=> {
                try {

                    let usuario = await usuariosManager.getByPopulate({email:username})
                    if(!usuario){
                        return done(null,false)
                    }

                    if(!validaPassword(password, usuario.password)){
                        return done(null,false)

                    }

                    usuario = {...usuario}
                    delete usuario.password //y resto de datos sensibles

                    return done(null,usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

//paso 1' 
    passport.serializeUser((usuario, done)=> {
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let usuario = await usuariosManager.getBy({_id:id})
        return done(null,usuario)
    })

}