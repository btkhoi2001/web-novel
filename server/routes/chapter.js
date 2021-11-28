import express from "express";
import commentRouter from "./comment.js";
import { verifyToken } from "../middlewares/auth.js";
import { verifyAuthor, verifyNovelOwnership } from "../middlewares/novel.js";
import { verifyChapterId } from "../middlewares/chapter.js";
import {
    getChapter,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
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
router.delete(
    "/:chapterId",
    verifyToken,
    verifyAuthor,
    verifyNovelOwnership,
    verifyChapterId,
    deleteChapter
);
router.use("/:chapterId/comment", verifyChapterId, commentRouter);

export default router;
