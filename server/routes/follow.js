import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createFollow, deleteFollow } from "../controllers/follow.js";

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.post("/", createFollow);
router.delete("/", deleteFollow);

export default router;
