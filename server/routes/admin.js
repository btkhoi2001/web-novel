import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
    getUser,
    updateUser,
    getNovel,
    updateNovel,
    getChapter,
    updateChapter,
    createNotification,
} from "../controllers/admin.js";
const router = express.Router();

router.use(verifyAdmin);

router.get("/user", getUser);
router.put("/user", updateUser);
router.get("/novel", getNovel);
router.put("/novel", updateNovel);
router.get("/chapter", getChapter);
router.put("/chapter", updateChapter);
router.post("/notification", createNotification);

export default router;
