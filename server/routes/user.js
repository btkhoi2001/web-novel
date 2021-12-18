import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { verifyUserId } from "../middlewares/user.js";
import { getUserProfile, getUserRecentRead } from "../controllers/user.js";
const router = express.Router();

router.get("/:userId", verifyUserId, getUserProfile);
router.get("/:userId/recent-read", verifyUserId, getUserRecentRead);
router.get("/");

router.use(verifyUser);
router.get("/account", getUserProfile);
router.put("/account");

export default router;
