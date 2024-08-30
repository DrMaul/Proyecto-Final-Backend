import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { productService } from '../services/ProductService.js';
import { cartService } from '../services/CartService.js';

import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";

export const router=Router()


router.get('/', async (req,res)=> {
    res.setHeader('Content-type', 'text/html')
    res.status(200).render('home',{login: req.session.usuario})
})

router.get("/carts/:cid",auth(["admin", "user","premium"]), async (req, res)=> {
    let {cid} = req.params


    let cart 
    try {
        cart = await cartService.getCartByPopulate(cid)
        if(!cart){
            return CustomError.createError("Error Not Found", null,`Carrito con ID:${cid} no encontrado`,TIPOS_ERROR.NOT_FOUND)
        }

    } catch (error) {
        return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
    }

    res.setHeader('Content-Type','text/html');
    return res.status(200).render("cart", {cart});
})

router.get('/realtimeproducts', async (req,res)=> {
    let products
    try {
        products = await productService.getProducts()
    } catch (error) {
        return CustomError.createError("Error", null,"Internal server Error",TIPOS_ERROR.INTERNAL_SERVER_ERROR)
        
    }
    res.setHeader('Content-type', 'text/html')
    res.status(200).render('realTimeProducts', {products})
})

router.get('/products', auth(["admin", "user","premium"]),async (req,res)=> {

    let cart= {
        _id: req.session.usuario.cart._id
    }

    let {page = 1, limit = 10, sort} =req.query
    if (page < 1) page = 1

    let pageConfig = {page: Number(page), limit: Number(limit), lean:true}


    let searchOptions = {}
    if(req.query.category){
        searchOptions.category = req.query.category
    }

    if(req.query.title) {
        searchOptions.title = {$regex: req.query.title, $options: "i"}
    }

    if(sort === "asc" || sort === "desc"){
        pageConfig.sort = {price: sort === "asc" ? 1 : -1}
    }

    let products = await productService.getProductsPaginate(searchOptions, pageConfig)

    let {prevPage, nextPage, totalPages, hasPrevPage, hasNextPage} = products
    prevPage = prevPage ? parseInt(prevPage) : null
    nextPage = nextPage ? parseInt(nextPage) : null

    let baseUrl = req.originalUrl.split("?")[0]
    let sortParam = sort ? `&sort=${sort}` : ""

    let prevLink = prevPage ? `${baseUrl}?page=${prevPage}${sortParam}` : null
    let nextLink = nextPage ? `${baseUrl}?page=${nextPage}${sortParam}` : null

    let categories = await productService.getCategories()

    /* let reqPage = parseInt(page)
    if(isNaN(reqPage)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Error en Page params`})
    } */

    

    /* let cart
    try {
        cart = await cartService.getCartByPopulate()
        if(!cart){
        console.log("Se crea nuevo Cart")
        cart = await cartService.createCart()
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    } */

    
    
    res.setHeader('Content-type', 'text/html')
    res.status(200).render('products', {
        status: "success",
        payload: products.docs,
        page,
        totalPages, 
        hasPrevPage, 
        hasNextPage, 
        prevPage, 
        nextPage,
        prevLink,
        nextLink,
        categories: categories, 
        cart,
        usuario:req.session.usuario
    })
})

router.get('/chat',auth(["user","premium"]), (req, res)=> {
    res.status(200).render('chat')
})

router.get('/registro',auth(["public"]),(req,res,next)=>{
    if(req.session.usuario){
        return res.redirect("/perfil")
    }
    next()
},(req,res)=>{
    let {error} = req.query

    res.status(200).render('registro', {error, login: req.session.usuario})
})

router.get('/login',auth(["public"]),(req,res,next)=>{
    if(req.session.usuario){
        return res.redirect("/perfil")
    }
    next()
},(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('login', {error, mensaje, login: req.session.usuario})
})

router.get('/perfil',auth(["admin", "user","premium"]),(req,res)=>{

    res.status(200).render('perfil',{
        usuario:req.session.usuario, login: req.session.usuario
    })
})

router.get("/documents/:id",(req,res)=>{
    let cart= {
        _id: req.session.usuario.cart._id
    }
    
    res.render("uploadDocuments",{usuario: req.session.usuario, cart})
})
