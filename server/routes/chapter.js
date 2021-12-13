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
router.post(
    "/",
    verifyToken,
    verifyAuthor,
    verifyNovelOwnership,
    createChapter
);

router.use("/:chapterId", verifyChapterId);

router.get("/:chapterId", getChapterById);
router.use("/:chapterId/comment", commentRouter);

router.use(verifyToken, verifyAuthor, verifyNovelOwnership);

router.put("/:chapterId", updateChapter);
router.delete("/:chapterId", deleteChapter);

export default router;
