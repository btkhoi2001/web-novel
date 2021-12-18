import express from "express";
import commentRouter from "./comment.js";
import { verifyUser, verifyAuthor } from "../middlewares/auth.js";
import { verifyNovelOwnership } from "../middlewares/novel.js";
import { verifyChapterId } from "../middlewares/chapter.js";
import {
    getChapter,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
    reportChapter,
} from "../controllers/chapter.js";

const router = express.Router({ mergeParams: true });

router.get("/", getChapter);
router.post("/", verifyUser, verifyAuthor, verifyNovelOwnership, createChapter);

router.use("/:chapterId", verifyChapterId);

router.get("/:chapterId", getChapterById);
router.post("/:chapterId/report", reportChapter);
router.use("/:chapterId/comment", commentRouter);

router.use(verifyUser, verifyAuthor, verifyNovelOwnership);

router.put("/:chapterId", updateChapter);
router.delete("/:chapterId", deleteChapter);

export default router;
