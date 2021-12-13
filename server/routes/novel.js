import express, { application } from "express";
import multer from "multer";
import chapterRouter from "./chapter.js";
import commentRouter from "./comment.js";
import ratingRouter from "./rating.js";
import followRouter from "./follow.js";
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
} from "../controllers/novel.js";

const router = express.Router({ mergeParams: true });
const upload = multer();

router.get("/", getNovel);
router.post(
    "/",
    upload.single("cover"),
    verifyToken,
    verifyAuthor,
    createNovel
);

router.use("/:novelId", verifyNovelId);

router.get("/:novelId", getNovelById);
router.use("/:novelId/rating", ratingRouter);
router.use("/:novelId/comment", commentRouter);
router.use("/:novelId/chapter", chapterRouter);
router.use("/:novelId/follow", followRouter);

router.use("/:novelId", verifyToken, verifyAuthor, verifyNovelOwnership);

router.put("/:novelId", upload.single("cover"), updateNovel);
router.delete("/:novelId", deleteNovel);

export default router;
