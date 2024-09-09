import { isValidObjectId } from "mongoose";
import { productService } from "../services/ProductService.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";

export class ProductController{
    static getProducts = async (req,res,next)=> {
        try {
            
            let products = await productService.getProducts()
            let limit = req.query.limit
            if(limit && limit > 0){
                products = products.slice(0, limit)
            }
            res.setHeader('Content-type', 'application/json')
            res.status(200).json({products})
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
        
    }

    static getProduct = async (req, res,next)=>{
        try {
            let id = req.params.pid
            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            
            let product = await productService.getProductBy({_id:id})
            if (!product){
                return CustomError.createError("Error Not Found", null,`No existe el producto con id: ${id}`,TIPOS_ERROR.NOT_FOUND)
            }
            res.setHeader('Content-type', 'application/json')
            return res.status(200).json({product})
            
        } catch (error) {
            next(error)
        }
    }

    static createProduct = async (req,res,next)=>{
        try {
            let {title, description, code, price, status, stock, category, thumbnail} = req.body

            let owner = "admin"
            if(req.session.usuario.rol === "premium"){
                 owner = req.session.usuario._id
                
            }

            // console.log("Owner: ",owner)
        
            //Se validan que todos los campos sean obligatorios
            if(!title || !description || !code || !price || !stock || !category){
                return CustomError.createError("Error argumentos invalidos", null,"Todos los campos son obligatorios",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            
            //Valido que se cumplan los tipos de datos específicos
            if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' ||
                    typeof price !== 'number' || typeof stock !== 'number' || typeof category !== 'string') {
                        return CustomError.createError("Error argumentos invalidos", null,"Los tipos de datos no son validos",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }
        
            //Setear "Status" a su valor "true" por defecto
            if (status === undefined) {
                status = true;
            } else if (typeof status !== 'boolean') {
                return CustomError.createError("Error argumentos invalidos", null,"El estado debe ser un valor booleano",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            
            //Valido si ya existe el producto en la BBDD
            let existe
            try {
                existe = await productService.getProductBy({code})
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
            if(existe){
                return CustomError.createError("Error argumentos invalidos", null,`El producto ${title} con código: ${code} ya existe`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            
            let product = await productService.addProduct({title, description, code, price, status, stock, category, thumbnail, owner}) 
            if (!product){
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
        
            req.io.emit("nuevoProducto", title)
            res.setHeader('Content-type', 'application/json')
            return res.status(201).json({product})
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
        
    }

    static updateProduct = async (req,res,next)=> {
        try {
            let id = req.params.pid
            let aModificar
        
            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
        
            let { editProduct, editProductValue } = req.body;

            aModificar = {[editProduct]: editProductValue}

            if(!editProduct || !editProductValue){
                aModificar = req.body
                if (aModificar._id){
                    delete aModificar._id
                }
            }

        
            if(aModificar.code){
                let existe = await productService.getProductBy({_id:{$ne:id},code: aModificar.code})
                if(existe){
                    return CustomError.createError("Error argumentos invalidos", null,`El producto ${aModificar.code} con código: ${aModificar.code} ya existe`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }
                
            }
        
            
            let productoModificado = await productService.updateProduct(id, aModificar)
            res.setHeader('Content-type', 'application/json')
            return res.status(200).json(productoModificado)
            
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
        
    }

    static deleteProduct = async (req,res,next)=> {
        try {
            let id = req.params.pid
        
            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }

            let ownerId =req.session.usuario._id
            let ownerRol =req.session.usuario.rol
            let producto
            let productoEliminado

            producto = await productService.getProductBy({_id:id})
            if(!producto){
                return CustomError.createError("Error Not Found", null,`No existe el producto con id: ${id}`,TIPOS_ERROR.NOT_FOUND)
            }

            let idProductOwner = producto.owner
            if(idProductOwner === ownerId && ownerRol === "premium" || ownerRol === "admin"){
                productoEliminado = await productService.deleteProduct(id)

            }
            else{
                return CustomError.createError("Acceso denegado", null, "No tienes permiso para eliminar este producto", TIPOS_ERROR.AUTORIZACION);
            }

            
            if(productoEliminado.deletedCount > 0){
                let productos = await productService.getProducts()
                req.io.emit("productoBorrado", productos)
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({payload:`Producto con id: ${id} eliminado`});

            }
            else {
                return CustomError.createError("Error Not Found", null,`No existen productos con id: ${id}`,TIPOS_ERROR.NOT_FOUND)
            }
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
    }

    static updateOwner = async (req,res,next)=> {
        
        let {userId} = req.body

        if(!isValidObjectId(userId)){
            return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        try {
            const resultado = await productService.updateOwner(userId);
            res.status(200).json({ message: "Todos los productos fueron actualizados con el nuevo owner.", resultado });
        } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Error al actualizar owner`})
        }
    }

    static uploadProductImage = async (req, res, next) => {
        try {
            let id = req.params.pid
            let productImage = req.file;

            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }

            if(!productImage){
                return CustomError.createError("Error", null,`Error archivos faltantes`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }


            let imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: new URLSearchParams({
                    key: "6937000a0b81776002404dd1a46a5785",
                    image: productImage.buffer.toString('base64')
                })
            });
            let imgbbData = await imgbbResponse.json();
            let imageUrl = imgbbData.data.url;
            let updatedProduct = await productService.updateThumbnail(id, imageUrl);

            const acceptsHtml = req.accepts('html');

            if (acceptsHtml) {
                res.redirect('/products');
            } else {
                res.status(200).json({ payload: `Imagen subida correctamente`, product: updatedProduct });
            }
            // res.status(200).json({ payload: `Imagen subida correctamente`, product: updatedProduct });
        } catch (error) {
            next(error);
        }
    }
}