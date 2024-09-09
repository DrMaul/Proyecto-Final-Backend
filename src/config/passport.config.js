import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { generaHash, validaPassword } from '../utils.js'
import { userService } from '../services/UserService.js'
import { cartService } from '../services/CartService.js'

//paso 1
export const initPassport = () => {

    passport.use(
        "github",
        new github.Strategy(
            {   
                clientID: "Iv23liPRCJzxkr5KfDmE",
                clientSecret: "0bad4a444de0170d99691529e038ca2493f0fcc6",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async(accessToken, refreshToken, profile, done)=> {
                try {
                    
                    let email = profile._json.email
                    let nombre = profile._json.name
                    if(!email){
                        return done(null,false)
                    }

                    let usuario = await userService.getUserByPopulate({email})
                    if(!usuario){
                        let nuevoCarrito = await cartService.createCart()
                        usuario = await userService.createUser(
                            {
                                nombre, email, profile, cart: nuevoCarrito._id 
                            }
                        )
                        usuario = await userService.getUserByPopulate({email})

                        
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
                    let {nombre, apellido, edad} = req.body
                    edad = parseInt(edad, 10);

                    // console.log("nombre: ",nombre)
                    // console.log("apellido: ",apellido)
                    // console.log("edad: ",edad)
                    // console.log("email: ",username)
                    // console.log("password: ",password)

                    let nombreRegex = /^[a-zA-Z\s\-']+$/
                    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    let passwordRegex = /^[A-Za-z0-9]{8,}$/;
                    

                    //Validación del nombre
                    if (!nombre || typeof nombre !== 'string' || nombre.length < 2 || nombre.length > 40 || !nombreRegex.test(nombre)) {
                        return done(null, false, { message: 'Nombre invalido' });
                    }

                    //Validación del apellido
                    if (!apellido || typeof apellido !== 'string' || apellido.length < 2 || apellido.length > 40 || !nombreRegex.test(apellido)) {
                        return done(null, false, { message: 'Apellido invalido' });
                    }

                    // Validación de la edad
                    if (typeof edad !== 'number' || edad < 0 || edad > 999) {
                        return done(null, false, { message: 'Edad invalida' });
                    }

                    let existe = await userService.getUserBy({email: username})
                    if(existe){
                        return done(null, false, { message: 'El correo ya está registrado' })
                    }

                    //Validación del email
                    if (!emailRegex.test(username)) {
                        return done(null, false, { message: 'Email invalido' });
                    }

                    //Validación de password
                    if (!passwordRegex.test(password)) {
                        return done(null, false, { message: 'Contraseña invalida' });
                    }


                    let nuevoCarrito = await cartService.createCart()
                    password = generaHash(password)

                    let usuario = await userService.createUser({first_name: nombre,last_name: apellido,age: edad, email:username, password, cart:nuevoCarrito._id})
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

                    let usuario = await userService.getUserByPopulate({email:username})
                    if(!usuario){
                        return done(null,false, { message: 'Email incorrecto' })
                    }

                    if(!validaPassword(password, usuario.password)){
                        return done(null,false, { message: 'Contraseña incorrecta' })

                    }

                    usuario = {...usuario}
                    delete usuario.password 

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
        let usuario = await userService.getUserBy({_id:id})
        return done(null,usuario)
    })

}