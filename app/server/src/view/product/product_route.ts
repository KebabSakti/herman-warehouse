import express from "express";
import * as controller from "./product_controller";

const router = express.Router();

router.post("/", controller.create);
router.get("/:id", controller.read);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.get("/", controller.list);

export default router;
