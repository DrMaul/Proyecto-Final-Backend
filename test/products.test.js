import mongoose, { isValidObjectId } from "mongoose";
import {afterEach,before, describe, it} from 'mocha'
import {expect} from 'chai'
import supertest from 'supertest-session'
import {config} from '../src/config/config.js'


const requester = supertest("http://localhost:8080")
let mockProduct = {title:"TestProduct", description:"Test", code:"Test", price:10, status:true, stock:10, category:"Test", thumbnail:"Test"}
let adminUser = {email: config.ADMINUSER, password: config.ADMINPASSWORD}

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

    before(async function(){
        await requester.post("/api/sessions/login").send(adminUser)
    })

    afterEach(async function(){
        await mongoose.connection.collection("products").deleteMany({title:"TestProduct"})
    })

    it("La ruta /api/products/:pid en su metodo get, retorna el producto buscado", async ()=>{
        let productTest = await requester.post("/api/products").send(mockProduct)
        let pid = productTest.body.product._id
        expect(pid).to.exist

        let res = await requester.get(`/api/products/${pid}`)
        expect(res.statusCode).to.exist.and.to.be.equal(200)

        let {body} = res
        expect(body).to.exist
        expect(isValidObjectId(body.product._id)).to.be.true
        expect(body.product._id).to.be.ok

    })

    it("La ruta /api/products en su metodo post, crea un nuevo producto", async ()=>{
        
        let res = await requester.post("/api/products").send(mockProduct)
        expect(res.statusCode).to.exist.and.to.be.equal(201)

        let {body} = res
        expect(body).to.exist
        expect(isValidObjectId(body.product._id)).to.be.true
        expect(body.product._id).to.be.ok
    })

    it("La ruta /api/products/:pid en su metodo delete, elimina un producto", async ()=>{
 
        let resCreateProd = await requester.post("/api/products").send(mockProduct)
        expect(resCreateProd.statusCode).to.exist.and.to.be.equal(201)

        let {body} = resCreateProd
        expect(body).to.exist
        expect(isValidObjectId(body.product._id)).to.be.true

        let pid = body.product._id
        expect(pid).to.exist

        let resGetProd = await requester.get(`/api/products/${pid}`)
        expect(resGetProd.statusCode).to.exist.and.to.be.equal(200)

        body = resGetProd.body

        expect(body).to.exist
        expect(isValidObjectId(body.product._id)).to.be.true
        expect(body.product._id).to.be.ok

        let resDelProd = await requester.delete(`/api/products/${pid}`)
        expect(resDelProd.statusCode).to.exist.and.to.be.equal(200)

        body = resDelProd.body
        expect(body.payload).to.exist

    })

})