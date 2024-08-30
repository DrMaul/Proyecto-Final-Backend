import { CartMongoDAO } from "../dao/CartMongoDAO.js"

class CartService{
    constructor(dao){
        this.cartDAO = dao
    }

    async getCarts() {
        return await this.cartDAO.get()
    }

    async getCartBy(filtro) {
        return await this.cartDAO.getBy(filtro)
    }

    async getCartByPopulate(id) {
        return await this.cartDAO.getByPopulate({_id:id}) 
    }

    async createCart() {
        return await this.cartDAO.create()
    }

    async addProductToCart(cartId, cart) {
        return await this.cartDAO.addProduct(cartId, cart)
    }

    async deleteCart(id){
        return await this.cartDAO.delete(id)
    }

    async deleteProductInCart(cartId, prodId){
        return await this.cartDAO.deleteProduct(cartId,prodId)
    }

    async updateCart(idCart, products){
        return await this.cartDAO.updateCart(idCart,products)
        
    }

    async updateProdInCart(idCart, prodId,  newQuantity){
        return await this.cartDAO.updateProduct(idCart,prodId,newQuantity)
    }
    
}

export const cartService = new CartService(new CartMongoDAO())