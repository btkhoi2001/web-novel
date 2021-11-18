import express from "express";
import multer from "multer";
import chapterRouter from "./chapter.js";
import { verifyToken } from "../middlewares/auth.js";
import {
    verifyAuthor,
    verifyNovelId,
    verifyOwnership,
} from "../middlewares/novel.js";
import {
    getNovel,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
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
    verifyOwnership,
    updateNovel
);
router.delete(
    "/:novelId",
    verifyToken,
    verifyNovelId,
    verifyAuthor,
    verifyOwnership,
    deleteNovel
);
router.use("/:novelId/chapter", chapterRouter);

export default router;
