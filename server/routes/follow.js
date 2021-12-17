import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { verifyNovelId } from "../middlewares/novel.js";
import {
    getFollow,
    createFollow,
    deleteFollow,
} from "../controllers/follow.js";

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.get("/", getFollow);

router.use(verifyNovelId);

router.post("/", createFollow);
router.delete("/", deleteFollow);

export default router;
