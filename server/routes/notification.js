import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { verifyNotificationId } from "../middlewares/notification.js";
import {
    getNotification,
    updateNotification,
    deleteNotification,
} from "../controllers/notification.js";

const router = express.Router();

router.use(verifyUser);

router.get("/", getNotification);

router.use("/:notificationId", verifyNotificationId);

router.put("/:notificationId", updateNotification);
router.use("/:notificationId", deleteNotification);

export default router;
