import { Router } from "express";
import { UserController } from "../controller/UserController.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../config/multer.config.js";


export const router=Router()

router.get("/premium/:id", auth(["admin","user","premium"]),UserController.cambiarRol)

router.get("/rol/:id", auth(["admin","user","premium"]),UserController.getRol)

router.get("/getUsuarios",auth(["admin"]),UserController.getUsuarios)

router.post("/:id/documents",auth(["admin","user","premium"]),upload.fields([{name:"profile",maxCount:1},{name:"product",maxCount:20},{name:"document",maxCount:1}]),UserController.uploadDocuments)

