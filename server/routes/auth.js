import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { register, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyUser, logout);

export default router;
