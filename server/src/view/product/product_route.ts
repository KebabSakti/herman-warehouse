import express from "express";
import * as controller from "./product_controller";

const router = express.Router();

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/", controller.remove);
router.get("/", controller.list);

export default router;
