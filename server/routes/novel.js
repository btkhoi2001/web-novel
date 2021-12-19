import express from "express";
import multer from "multer";
import chapterRouter from "./chapter.js";
import commentRouter from "./comment.js";
import ratingRouter from "./rating.js";
import { verifyUser, verifyAuthor } from "../middlewares/auth.js";
import { verifyNovelId, verifyNovelOwnership } from "../middlewares/novel.js";
import {
    getNovel,
    getNovelGenre,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
    createNomination,
} from "../controllers/novel.js";

const router = express.Router({ mergeParams: true });
const upload = multer();

router.get("/", getNovel);
router.get("/genre", getNovelGenre);
router.post("/", upload.single("cover"), verifyUser, verifyAuthor, createNovel);

router.use("/:novelId", verifyNovelId);

router.get("/:novelId", getNovelById);
router.post("/:novelId/nomination", verifyUser, createNomination);
router.use("/:novelId/rating", ratingRouter);
router.use("/:novelId/comment", commentRouter);
router.use("/:novelId/chapter", chapterRouter);

router.use("/:novelId", verifyUser, verifyAuthor, verifyNovelOwnership);

router.put("/:novelId", upload.single("cover"), updateNovel);
router.delete("/:novelId", deleteNovel);

export default router;
