import __dirname, { logger, middLogger } from './utils.js'
import path from 'path'
import {config} from './config/config.js'
import { errorHandler } from './middleware/errorHandler.js';

import express from 'express';
import mongoose from 'mongoose';
import {engine} from "express-handlebars"
import sessions from 'express-session'
import MongoStore from 'connect-mongo'
import { initPassport } from './config/passport.config.js';
import passport from 'passport';

import { router as productsRouter} from './routes/products.router.js';
import {router as cartsRouter} from './routes/carts.router.js'
import {router as vistasRouter} from './routes/vistas.router.js'
import { router as sessionsRouter } from './routes/sessions.router.js';
import { router as mockingRouter} from './routes/mocking.router.js';
import { router as loggerRouter} from './routes/logger.router.js';
import { router as usuariosRouter} from './routes/usuarios.router.js';
import { router as passwordRouter} from './routes/password.router.js';

import swaggerUI from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'



import {Server} from 'socket.io'
import {messagesModelo} from './dao/models/messages.modelo.js'


const PORT = 8080
const app = express()

let io

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'/public')))
app.use(sessions({
    secret: config.SECRET,
    resave: true, 
    saveUninitialized:true,
    store: MongoStore.create({
        ttl:3600,
        mongoUrl: config.MONGO_URL
    })
}))

app.use(middLogger)
//paso 2
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, '/views'))

const options={
    definition:{
        openapi: "3.0.0",
        info:{
            title:"Api Ecommerce",
            version: "1.0.0",
            description:"Documentación Ecommerce"
        },
    },
    apis: ["./src/docs/*.yaml"]
}
const spec=swaggerJsDoc(options)



app.use('/api/products', (req,res,next)=>{
    req.io = io

    next()
}, productsRouter)
app.use('/api/carts', cartsRouter)
app.use("/", vistasRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/mockingproducts", mockingRouter)
app.use("/loggerTest", loggerRouter)
app.use("/api/users", usuariosRouter)
app.use("/", passwordRouter)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec))

let usuarios = []

app.use(errorHandler)

const server = app.listen(PORT, ()=>console.log(`Servidor online en puerto ${PORT}`))

io = new Server(server)

io.on("connection", socket=>{
    logger.info(`Cliente id: ${socket.id} conectado`)
    // console.log(`Cliente id: ${socket.id} conectado`)

    socket.on("id", async(nombre)=>{
        usuarios.push({id:socket.id, nombre})
        let mensajes=await messagesModelo.find().lean()
        mensajes=mensajes.map(m=>{
            return {nombre: m.user, mensaje: m.message}
        })
        socket.emit("mensajesPrevios", mensajes)
        socket.broadcast.emit("nuevoUsuario", nombre)
    })

    socket.on("mensaje", async(nombre, mensaje)=>{
        await messagesModelo.create({user:nombre, message: mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            io.emit("saleUsuario", usuario.nombre)
        }
    })

})

const connDB = async() => {
    try {
        //await mongoose.connect("mongodb+srv://agusfmartinez:CoderCoder@cluster0.zvgrerx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=clase14")
        await mongoose.connect(config.MONGO_URL)
        logger.info("DB Online")
        console.log("DB Online")
    } catch (error) {
        logger.error("Error al conectar a DB: "+error.message)
        // console.log("Error al conectar a DB", error.message)
    }
}

connDB()

