import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyNovelId } from "../middlewares/novel.js";
import {
    getBookmark,
    createBookmark,
    deleteBookmark,
} from "../controllers/bookmark.js";

const router = express.Router({ mergeParams: true });

router.get("/", verifyToken, getBookmark);
router.post("/", verifyToken, verifyNovelId, createBookmark);
router.delete("/", verifyToken, verifyNovelId, deleteBookmark);

export default router;
