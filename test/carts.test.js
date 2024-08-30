import mongoose, { isValidObjectId } from "mongoose";
import {afterEach,before, describe, it} from 'mocha'
import {expect} from 'chai'
import supertest from 'supertest-session'



const requester = supertest("http://localhost:8080")

const connDB = async() => {
    try {
        await mongoose.connect("mongodb+srv://agusfmartinez:CoderCoder@cluster0.zvgrerx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce")
        console.log("DB Online")
    } catch (error) {
        console.log("Error al conectar a DB", error.message)
    }
}
connDB()

describe("Prueba proyecto - Carts", function(){
    this.timeout(10000)
    let cartId

    afterEach(async function(){
        console.log(cartId)
        await mongoose.connection.collection("carts").deleteOne({_id:cartId})
    })

    it("La ruta /api/cart/:cid en su metodo get, retorna el carrito buscado", async ()=>{
        let cartTest = await requester.post("/api/carts")
        let cid = cartTest.body.cart._id
        expect(cid).to.exist

        let res = await requester.get(`/api/carts/${cid}`)
        expect(res.statusCode).to.exist.and.to.be.equal(200)

        let {body} = res
        expect(body).to.exist
        expect(isValidObjectId(body.cart._id)).to.be.true
        expect(body.cart._id).to.be.ok

        cartId = body.cart._id

    })

    it("La ruta /api/carts en su metodo post, crea un nuevo carrito", async ()=>{
        
        let res = await requester.post("/api/carts")
        expect(res.statusCode).to.exist.and.to.be.equal(201)

        let {body} = res
        expect(body).to.exist
        expect(isValidObjectId(body.cart._id)).to.be.true
        expect(body.cart._id).to.be.ok
        cartId = body.cart._id
    })

    it("La ruta /api/carts/:cid en su metodo delete, elimina un carrito", async ()=>{
 
        let resCreateCart = await requester.post("/api/carts")
        expect(resCreateCart.statusCode).to.exist.and.to.be.equal(201)

        let {body} = resCreateCart
        expect(body).to.exist
        expect(isValidObjectId(body.cart._id)).to.be.true

        let cid = body.cart._id
        expect(cid).to.exist

        let resGetCart = await requester.get(`/api/carts/${cid}`)
        expect(resGetCart.statusCode).to.exist.and.to.be.equal(200)

        body = resGetCart.body

        expect(body).to.exist
        expect(isValidObjectId(body.cart._id)).to.be.true
        expect(body.cart._id).to.be.ok

        let resDelCart = await requester.delete(`/api/carts/${cid}`)
        expect(resDelCart.statusCode).to.exist.and.to.be.equal(200)

        body = resDelCart.body
        expect(body.payload).to.exist


    })

})