import express from "express";
import { getNovel, createNovel } from "../controllers/novel.js";
import { verifyToken } from "../middlewares/auth.js";
import { verifyAuthor } from "../middlewares/novel.js";

const router = express.Router();

router.get("/", getNovel);
router.post("/", verifyToken, verifyAuthor, createNovel);

export default router;
