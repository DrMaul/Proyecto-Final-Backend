import { Router } from "express";
import { PasswordController } from "../controller/PasswordController.js";

export const router=Router()

router.get("/resetPassword", PasswordController.resetForm)
router.post("/resetPassword", PasswordController.sendMail)
router.get("/resetPassword/:token", PasswordController.sendResetPassword)
router.post("/resetPassword/:token", PasswordController.resetPassword)