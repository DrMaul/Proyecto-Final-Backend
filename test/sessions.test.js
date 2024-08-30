import mongoose, { isValidObjectId } from "mongoose";
import {afterEach,before, describe, it} from 'mocha'
import {expect} from 'chai'
import supertest from 'supertest-session'


const requester = supertest("http://localhost:8080")
let mockUser = {nombre:"Test", email:"Test@mail.com", password:"123"}

const connDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://agusfmartinez:CoderCoder@cluster0.zvgrerx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce")
        console.log("DB Online")
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }
}
connDB()

describe("Prueba proyecto - Products", function(){
    this.timeout(10000)


    afterEach(async function(){
        await mongoose.connection.collection("usuarios").deleteMany({email:"Test@mail.com"})
        await requester.get("/api/sessions/logout")
    })

    it("La ruta /api/sessions/registro en su metodo post, crea un nuevo usuario", async ()=>{

        let res = await requester.post("/api/sessions/registro").send(mockUser)
        expect(res.statusCode).to.exist.and.to.be.equal(200)

        let {body} = res
        expect(body).to.exist
        expect(body.payload).to.exist.and.to.be.equal("Registro exitoso")


    })

    it("La ruta /api/sessions/login en su metodo post, inicia sesion a un usuario", async ()=>{
        
        let res = await requester.post("/api/sessions/registro").send(mockUser)
        expect(res.statusCode).to.exist.and.to.be.equal(200)

        let {body} = res
        expect(body).to.exist
        expect(body.payload).to.exist.and.to.be.equal("Registro exitoso")

        let resLogin = await requester.post("/api/sessions/login").send(mockUser)
        body = resLogin.body
        expect(body).to.exist
        expect(body.payload).to.exist.and.to.be.equal("Login exitoso")

        let usuario = body.usuario
        expect(usuario).to.exist
        expect(usuario.email).to.be.equal(mockUser.email)
        expect(isValidObjectId(usuario._id)).to.be.true
    })

    it("La ruta /api/sessions/current en su metodo get, devuelve el usuario actual", async ()=>{
 
        let res = await requester.post("/api/sessions/registro").send(mockUser)
        expect(res.statusCode).to.exist.and.to.be.equal(200)

        let {body} = res
        expect(body).to.exist
        expect(body.payload).to.exist.and.to.be.equal("Registro exitoso")

        let resLogin = await requester.post("/api/sessions/login").send(mockUser)
        body = resLogin.body
        expect(body).to.exist
        expect(body.payload).to.exist.and.to.be.equal("Login exitoso")

        let usuario = body.usuario
        expect(usuario).to.exist
        expect(usuario.email).to.be.equal(mockUser.email)
        expect(isValidObjectId(usuario._id)).to.be.true

        let resCurrent = await requester.get("/api/sessions/current")
        body = resCurrent.body
        expect(body).to.exist
        expect(body.userDTO).to.exist.and.to.be.ok

    })

})