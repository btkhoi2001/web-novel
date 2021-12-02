import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyCommentId } from "../middlewares/comment.js";
import {
    getComment,
    createComment,
    createCommentLike,
    deleteCommentLike,
} from "../controllers/comment.js";
const router = express.Router({ mergeParams: true });

router.get("/", getComment);
router.post("/", verifyToken, createComment);
router.post(
    "/:commentId/like",
    verifyToken,
    verifyCommentId,
    createCommentLike
);
router.delete(
    "/:commentId/like",
    verifyToken,
    verifyCommentId,
    deleteCommentLike
);
export default router;
