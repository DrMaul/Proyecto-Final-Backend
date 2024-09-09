import { Router } from "express";
import { auth } from '../middleware/auth.js';
import { ProductController } from "../controller/ProductController.js";
import { uploadMemoryStorage } from "../config/multer.config.js";
export const router=Router()


router.get("/", ProductController.getProducts)

router.get("/:pid", ProductController.getProduct )

router.post('/',auth(["admin","premium"]),ProductController.createProduct)

router.put("/:pid", auth(["admin","premium"]),ProductController.updateProduct)

router.delete("/:pid",auth(["admin","premium"]), ProductController.deleteProduct)

router.post('/updateOwner',auth(["admin"]),ProductController.updateOwner)

router.post("/uploadImage/:pid", auth(["admin"]),uploadMemoryStorage.single("thumbnail"),  ProductController.uploadProductImage)