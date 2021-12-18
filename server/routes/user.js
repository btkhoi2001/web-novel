import express from "express";
import multer from "multer";
import { verifyUser } from "../middlewares/auth.js";
import { verifyUserId } from "../middlewares/user.js";
import {
    getUserProfile,
    getUserRecentRead,
    getUserAccount,
    updateUserAccount,
} from "../controllers/user.js";

const router = express.Router();
const upload = multer();

router.get("/account", verifyUser, getUserAccount);
router.put("/account", upload.single("avatar"), verifyUser, updateUserAccount);

router.use("/:userId", verifyUserId);
router.get("/:userId", getUserProfile);
router.get("/:userId/recent-read", getUserRecentRead);

export default router;
