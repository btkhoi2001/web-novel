import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyNovelId } from "../middlewares/novel.js";
import { createBookmark, deleteBookmark } from "../controllers/bookmark.js";

const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, verifyNovelId, createBookmark);
router.delete("/", verifyToken, verifyNovelId, deleteBookmark);

export default router;
