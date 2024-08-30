import {productsModelo} from "./models/products.modelo.js"

export class ProductMongoDAO {

    async get(){
        return await productsModelo.find().lean()
    }
    
    async getBy(filtro){
        return await productsModelo.findOne(filtro).lean()
    }
    
    async create(product) {
        return await productsModelo.create(product)
    }
    
    async update(idProd, product){
        return await productsModelo.findByIdAndUpdate(idProd, product, {runValidators: true, returnDocument: "after"}).lean()
    }
    
    async delete(idProd){
        return await productsModelo.deleteOne({_id:idProd})
    }
    
    async paginate(filter, options){
        return await productsModelo.paginate(filter, options)
    }

    async distinct(){
        return await productsModelo.distinct("category")
    }

    async updateOwner(id) {
        return await productsModelo.updateMany({}, { owner: id });
    }
    
    
}


