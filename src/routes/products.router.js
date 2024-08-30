import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { ProductController } from "../controller/ProductController.js";
export const router=Router()


router.get("/", ProductController.getProducts)

router.get("/:pid", ProductController.getProduct )

router.post('/',auth(["admin","premium"]),ProductController.createProduct)

router.put("/:pid", auth(["admin","premium"]),ProductController.updateProduct)

router.delete("/:pid",auth(["admin","premium"]), ProductController.deleteProduct)

router.post('/updateOwner',auth(["admin"]),ProductController.updateOwner)

