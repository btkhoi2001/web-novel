import express from "express";
import multer from "multer";
import chapterRouter from "./chapter.js";
import commentRouter from "./comment.js";
import { verifyToken } from "../middlewares/auth.js";
import {
    verifyAuthor,
    verifyNovelId,
    verifyNovelOwnership,
} from "../middlewares/novel.js";
import {
    getNovel,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
    createRatingNovel,
} from "../controllers/novel.js";

const router = express.Router();
const upload = multer();

router.get("/", getNovel);
router.get("/:novelId", verifyNovelId, getNovelById);
router.post(
    "/",
    upload.single("cover"),
    verifyToken,
    verifyAuthor,
    createNovel
);
router.put(
    "/:novelId",
    upload.single("cover"),
    verifyToken,
    verifyNovelId,
    verifyAuthor,
    verifyNovelOwnership,
    updateNovel
);
router.delete(
    "/:novelId",
    verifyToken,
    verifyNovelId,
    verifyAuthor,
    verifyNovelOwnership,
    deleteNovel
);
router.post("/:novelId/rating", verifyToken, verifyNovelId, createRatingNovel);
router.use("/:novelId/chapter", verifyNovelId, chapterRouter);
router.use("/:novelId/comment", verifyNovelId, commentRouter);

export default router;
