import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createFollow, deleteFollow } from "../controllers/follow.js";

const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, createFollow);

export default router;
