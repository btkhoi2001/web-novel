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

router.use(verifyToken);

router.post("/", createComment);

router.use("/:commentId", verifyCommentId);

router.post("/:commentId/like", createCommentLike);
router.delete("/:commentId/like", deleteCommentLike);

export default router;
