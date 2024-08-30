import {cartsModelo} from "./models/carts.modelo.js"

export class CartMongoDAO {

    async get(){
        return await cartsModelo.find().lean()
    }

    async getBy(filtro){
        return await cartsModelo.findOne(filtro).lean()
    }

    async getByPopulate(filtro){
        return await cartsModelo.findOne(filtro).populate("products.product").lean()
    }

    async create() {
        return await cartsModelo.create({products:[]})
    }

    async addProduct(cartId, cart) {
        return await cartsModelo.updateOne({_id:cartId}, cart)
    }

    async delete(cartId){
        return await cartsModelo.deleteOne({_id:cartId})
    }

    async deleteProduct(cartId, prodId){
        return await cartsModelo.updateOne(
            { _id: cartId },
            { $pull: { products: { product: prodId } } }
          );
    }

    async updateCart(idCart, products){
        return await cartsModelo.findByIdAndUpdate(idCart, {$set: {products: products}}, {runValidators: true, returnDocument: "after"})
        
    }

    async updateProduct(idCart, prodId,  newQuantity){
        return await cartsModelo.findOneAndUpdate(
            { _id: idCart, 'products.product':prodId },
            { $set: { 'products.$.quantity': newQuantity }},
            {new: true}
          ).populate("products.product");
    }
    
}
