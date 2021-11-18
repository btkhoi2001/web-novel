import express from "express";
import {
    getNovel,
    getNovelById,
    createNovel,
    updateNovel,
    deleteNovel,
} from "../controllers/novel.js";
import { verifyToken } from "../middlewares/auth.js";
import {
    verifyAuthor,
    verifyNovelId,
    verifyOwnership,
} from "../middlewares/novel.js";
import multer from "multer";

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

export default router;
