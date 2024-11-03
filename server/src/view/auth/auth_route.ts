import express from "express";
import * as auth from "./auth_controller";

const router = express.Router();

router.post("/login", auth.login);
router.post("/reset", auth.reset);

export default router;
