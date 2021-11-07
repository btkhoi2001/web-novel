import express from "express";
import {
    getNovel,
    getNovelById,
    createNovel,
    updateNovel,
} from "../controllers/novel.js";
import { verifyToken } from "../middlewares/auth.js";
import {
    verifyAuthor,
    verifyNovelId,
    verifyOwnership,
} from "../middlewares/novel.js";

const router = express.Router();

router.get("/", getNovel);
router.get("/:novelId", verifyNovelId, getNovelById);
router.post("/", verifyToken, verifyAuthor, createNovel);
router.put(
    "/:novelId",
    verifyToken,
    verifyNovelId,
    verifyAuthor,
    verifyOwnership,
    updateNovel
);

export default router;
