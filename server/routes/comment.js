import express from "express";
import { createComment } from "../controllers/comment.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, createComment);

export default router;
