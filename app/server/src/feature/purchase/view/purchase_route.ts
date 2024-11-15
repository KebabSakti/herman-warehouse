import express from "express";
import * as purchaseController from "../controller/purchase_controller";

const router = express.Router();

router.get("/", purchaseController.list);
router.post("/", purchaseController.create);
router.get("/:id", purchaseController.read);

export default router;
