import { isValidObjectId } from "mongoose";
import { cartService } from "../services/CartService.js";
import { productService } from "../services/ProductService.js";
import { ticketService } from "../services/TicketService.js";
import { enviarMail } from "../config/mailing.config.js";
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";

export class CartController{
    static getCarts = async (req,res, next)=> {
        try {
            try {
            let carts = await cartService.getCarts()
            let limit = req.query.limit
            if(limit && limit > 0){
                products = products.slice(0, limit)
            }
        
            res.setHeader('Content-type', 'application/json')
            res.status(200).json({carts})
    
        } catch (error) {
            return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static createCart = async (req,res, next)=>{
        try {
            try {
            let cart = await cartService.createCart() 
            res.setHeader('Content-type', 'application/json')
            return res.status(201).json({cart})
            
        } catch (error) {
            return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static getCart = async (req, res,next)=>{
        try {
            let id = req.params.cid
            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
        
            try {
                let cart = await cartService.getCartByPopulate(id)
                if (!cart){
                    return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${id}`,TIPOS_ERROR.NOT_FOUND)
                }
                res.setHeader('Content-type', 'application/json')
                return res.status(200).json({cart})
                
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static addProductToCart = async (req, res, next) => {
        try {
            let { cid, pid } = req.params;
            if(!isValidObjectId(cid) || !isValidObjectId(pid)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }

            let ownerId =req.session.usuario._id
            let ownerRol =req.session.usuario.rol
            try {
                let product = await productService.getProductBy({_id:pid})
                if(product){
                    let idProductOwner = product.owner
                    if(idProductOwner === ownerId && ownerRol === "premium"){
                        return CustomError.createError("Error ID", null,"Un usuario premium no puede agregar al carrito su propio producto",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)

                    }
                    else {return CustomError.createError("Error Not Found", null,`El producto con id: ${pid} no existe`,TIPOS_ERROR.NOT_FOUND)
                    }
                }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
            
            try {
                let cart = await cartService.getCartBy({_id:cid})
                if (cart){
                    let productExist = cart.products.find(p => p.product == pid);
                    if (productExist) {   
                        productExist.quantity += 1; 
                    } else {
                        cart.products.push({product: pid, quantity: 1}); 
                    }   
                }
                else {
                return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${cid}`,TIPOS_ERROR.NOT_FOUND)
                }
                let productoAgregado = await cartService.addProductToCart(cid, cart);
                res.setHeader('Content-type', 'application/json')
                return res.status(201).json({productoAgregado})
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static deleteCart = async (req,res, next)=> {
        try {
            let id = req.params.cid
            if(!isValidObjectId(id)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            try{
                let cartEliminado = await cartService.deleteCart(id)
                if(cartEliminado.deletedCount > 0){
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({payload:`Carrito con id: ${id} eliminado`});
                }
                else {
                    return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${id}`,TIPOS_ERROR.NOT_FOUND)
                }
        
            }catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static deleteProductInCart = async (req, res, next) => {
        try {
            let { cid, pid } = req.params;
            if(!isValidObjectId(cid) || !isValidObjectId(pid)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            try {
                let product = await productService.getProductBy({_id:pid})
                if(!product){
                return CustomError.createError("Error Not Found", null,`No existe el producto con ID:${pid}`,TIPOS_ERROR.NOT_FOUND)
            }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
            try {
                let cart = await cartService.getCartById(cid)
                if(!cart){
                return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${cid}`,TIPOS_ERROR.NOT_FOUND)
            }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
        
            try {
                let prodDeleted = await cartService.deleteProductInCart(cid, pid)
                if(prodDeleted){
                    res.setHeader('Content-Type','application/json');
                    return res.status(200).json({payload:`Producto ${pid} eliminado del carrito ${cid}`});
                }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static updateCart = async (req,res, next)=> {
        try {
            let cid = req.params.cid
            let products = req.body
            if(!isValidObjectId(cid)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            try {
                let cart = await cartService.getCartById(cid)
                if(cart){
                    let cartModificado = await cartService.updateCart(cid, products)
                    if(cartModificado){
                        res.setHeader('Content-type', 'application/json')
                        return res.status(200).json({cartModificado}) 
                    }else{
                        return CustomError.createError("Error", null,"Error al modificar",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                    }
                    
                }else{
                    return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${cid}`,TIPOS_ERROR.NOT_FOUND)
                }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static updateProdInCart = async (req,res,next)=> {
        try {
            let { cid, pid } = req.params;
            let {quantity} = req.body
            if(!isValidObjectId(cid) || !isValidObjectId(pid)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            try {
                let product = await productService.getProductBy({_id:pid})
                if(!product){
                return CustomError.createError("Error Not Found", null,`No existe el producto con ID:${pid}`,TIPOS_ERROR.NOT_FOUND)
            }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
            }
        
            try {
                let cart = await cartService.getCartById(cid)
                if(cart){
                    let prodEnCartModificado = await cartService.updateProdInCart(cid,pid, quantity)
                    if(prodEnCartModificado){
                        res.setHeader('Content-type', 'application/json')
                        return res.status(200).json({prodEnCartModificado})
                    }else{
                        return CustomError.createError("Error", null,"Error al modificar",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                    }
                    
                }else {
                    return CustomError.createError("Error ID", null,`No existe el carrito con ID:${cid}`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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

    static createTicket = async (req,res, next) => {
        try {
            let {cid} = req.params
            let purchaser = req.session.usuario.email
            if(!isValidObjectId(cid)){
                return CustomError.createError("Error ID", null,"Ingresar ID valido de MongoDB",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
            }
            let cart = await cartService.getCartByPopulate(cid)
            if(!cart){
                return CustomError.createError("Error Not Found", null,`No existe el carrito con ID:${cid}`,TIPOS_ERROR.NOT_FOUND)
            }
            let stockProducts = []
            let amount = 0
            for (let i = cart.products.length - 1; i >= 0; i--) {
                let cartProduct = cart.products[i].product
                let quantity = cart.products[i].quantity
                
                if (cartProduct.stock >= quantity) {
                    stockProducts.push({
                        title: cartProduct.title,
                        price: cartProduct.price
                    })

                    let product
                    try {
                        product = await productService.getProductBy({_id: cartProduct._id})
                        if(!product){
                            return CustomError.createError("Error Not Found", null,`Error al obtener el producto con id: ${cartProduct._id} de la BBDD`,TIPOS_ERROR.NOT_FOUND) 
                        }
                        product.stock = product.stock - quantity

                        //Actualizar producto con nuevo stock
                        await productService.updateProduct(cartProduct._id, product)

                        // Acumular el precio del producto disponible en stock
                        amount += cartProduct.price * quantity;

                        // Eliminar producto del carrito
                        await cartService.deleteProductInCart(cid, cartProduct._id)
                    } catch (error) {
                        return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
                    }
                } else {
                    return CustomError.createError("Error", null,`El producto ${cartProduct.title} no tiene stock.`,TIPOS_ERROR.ARGUMENTOS_INVALIDOS)

                }
            }
            
            //Si el total es > 0, significa que se ha comprado al menos 1 producto que tenga stock
            try {
                if(amount>0){
                
                let ticket = await ticketService.createTicket(amount, purchaser)
                if(!ticket){
                    return CustomError.createError("Error Ticket", null,"Error al crear el ticket",TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
                }
                //Funcion para enviar el mail de resumen de compra
                enviarMail(purchaser, ticket.code, amount, ticket.purchase_datetime, stockProducts)
                }
                
                res.setHeader('Content-Type','application/json');
                return res.status(200).json({ticket});
            } catch (error) {
                return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
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
}