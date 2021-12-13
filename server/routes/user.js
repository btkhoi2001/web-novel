import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyUserId } from "../middlewares/user.js";
import { getUserProfile } from "../controllers/user.js";
const router = express.Router();

router.use(verifyToken);
router.get("/profile", getUserProfile);
router.put("/profile");

export default router;
