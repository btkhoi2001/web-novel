import express from "express";
import {
    getNovel,
    getNovelById,
    createNovel,
    updateNovel,
} from "../controllers/novel.js";
import { verifyToken } from "../middlewares/auth.js";
import { verifyAuthor } from "../middlewares/novel.js";

const router = express.Router();

router.get("/", getNovel);
router.get("/:novelId", getNovelById);
router.post("/", verifyToken, verifyAuthor, createNovel);
router.put("/:novelId", updateNovel);

export default router;
