import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
    verifyAuthor,
    verifyNovelId,
    verifyOwnership,
} from "../middlewares/novel.js";
import { getChapter, createChapter } from "../controllers/chapter.js";

const router = express.Router({ mergeParams: true });

router.get("/", getChapter);
router.post(
    "/",
    verifyToken,
    verifyAuthor,
    verifyNovelId,
    verifyOwnership,
    createChapter
);

export default router;
