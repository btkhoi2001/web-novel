import express from "express";
import { getComment, createComment } from "../controllers/comment.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router({ mergeParams: true });

router.get("/", getComment);
router.post("/", verifyToken, createComment);

export default router;
