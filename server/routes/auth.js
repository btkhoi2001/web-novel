import express from "express";
import { loggedIn, register, login } from "../controllers/auth.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, loggedIn);
router.post("/register", register);
router.post("/login", login);

export default router;
