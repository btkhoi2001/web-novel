import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { verifyUserId } from "../middlewares/user.js";
import { getUserProfile } from "../controllers/user.js";
const router = express.Router();

router.get("/:userId", verifyUserId, getUserProfile);

router.use(verifyUser);
router.get("/account", getUserProfile);
router.put("/account");

export default router;
