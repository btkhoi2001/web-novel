import express from "express";
import { verifyToken } from "../middlewares/auth.js";
// import { verifyNovelId } from "../middlewares/novel.js";
import { verifyChapterId } from "../middlewares/chapter.js";
import {
    getBookmark,
    createBookmark,
    deleteBookmark,
} from "../controllers/bookmark.js";

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.get("/", getBookmark);

router.use(verifyChapterId);
router.post("/", createBookmark);
router.delete("/", deleteBookmark);

export default router;
