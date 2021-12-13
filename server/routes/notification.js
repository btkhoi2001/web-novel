import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { getNotification } from "../controllers/notification.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getNotification);

export default router;
