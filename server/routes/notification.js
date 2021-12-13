import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyNotificationId } from "../middlewares/notification.js";
import {
    getNotification,
    updateNotification,
    deleteNotification,
} from "../controllers/notification.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getNotification);

router.use("/:notificationId", verifyNotificationId);

router.put("/:notificationId", updateNotification);
router.use("/:notificationId", deleteNotification);

export default router;
