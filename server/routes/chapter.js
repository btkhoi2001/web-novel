import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyAuthor, verifyNovelOwnership } from "../middlewares/novel.js";
import { verifyChapterId } from "../middlewares/chapter.js";
import {
    getChapter,
    getChapterById,
    createChapter,
    updateChapter,
} from "../controllers/chapter.js";

const router = express.Router({ mergeParams: true });

router.get("/", getChapter);
router.get("/:chapterId", verifyChapterId, getChapterById);
router.post(
    "/",
    verifyToken,
    verifyAuthor,
    verifyNovelOwnership,
    createChapter
);
router.put(
    "/:chapterId",
    verifyToken,
    verifyAuthor,
    verifyNovelOwnership,
    verifyChapterId,
    updateChapter
);
export default router;
