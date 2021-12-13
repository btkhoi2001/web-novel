import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyNotificationId } from "../middlewares/notification.js";
import {
    getNotification,
    updateNotification,
} from "../controllers/notification.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getNotification);

router.use("/:notificationId", verifyNotificationId);

router.put("/:notificationId", updateNotification);

export default router;
