import express from "express";
import multer from "multer";
import { verifyUser } from "../middlewares/auth.js";
import { verifyUserId } from "../middlewares/user.js";
import {
    getUserProfile,
    getUserRecentRead,
    getUserAccount,
    updateUserAccount,
    updatePassword,
    createVerificationToken,
    verifyVerificationToken,
    createResetPasswordToken,
    verifyResetPasswordToken,
} from "../controllers/user.js";

const router = express.Router();
const upload = multer();

router.post("/verify/:token", verifyVerificationToken);
router.post("/verify", verifyUser, createVerificationToken);
router.post("/reset-password", createResetPasswordToken);
router.post("/reset-password/:token", verifyResetPasswordToken);
router.get("/account", verifyUser, getUserAccount);
router.put("/account", upload.single("avatar"), verifyUser, updateUserAccount);
router.put("/account/change-password", verifyUser, updatePassword);

router.use("/:userId", verifyUserId);

router.get("/:userId", getUserProfile);
router.get("/:userId/recent-read", getUserRecentRead);

export default router;
