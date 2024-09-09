import { ProductMongoDAO } from "../dao/ProductMongoDAO.js"


class ProductService{
    constructor(dao){
        this.productDAO = dao
    }

    async getProducts(){
        return await this.productDAO.get()
    }

    async getProductBy(filtro){
        return await this.productDAO.getBy(filtro)
    }

    async addProduct(product) {
        return await this.productDAO.create(product)
    }

    async updateProduct(id, product){
        return await this.productDAO.update(id, product)
    }

    async deleteProduct(id){
        return await this.productDAO.delete(id)
    }

    async getProductsPaginate(filter, options){
        return await this.productDAO.paginate(filter, options)
    }

    async getCategories(){
        return await this.productDAO.distinct()
    }

    async updateOwner(id) {
        return await this.productDAO.updateOwner(id);
    }
    
    async updateThumbnail(id, thumbnailUrl){
        return await this.productDAO.updateThumbnail(id, thumbnailUrl)
    }
    
}

export const productService = new ProductService(new ProductMongoDAO())