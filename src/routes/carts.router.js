import { Router } from "express";
import { CartController } from '../controller/CartController.js';
import { auth } from '../middleware/auth.js';

export const router=Router()

router.get("/", CartController.getCarts)

router.post('/',CartController.createCart)

router.get("/:cid", CartController.getCart)

router.post('/:cid/product/:pid', auth(["user", "premium"]),CartController.addProductToCart)

router.delete("/:cid", CartController.deleteCart)

router.delete('/:cid/product/:pid', CartController.deleteProductInCart)

router.put("/:cid", CartController.updateCart)

router.put("/:cid/product/:pid", CartController.updateProdInCart)

router.get("/:cid/purchase", CartController.createTicket)