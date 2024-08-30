import { Router } from "express";
import { MockingController } from "../controller/MockingController.js";
export const router=Router()

router.get("/", MockingController.generateProductsMocks)