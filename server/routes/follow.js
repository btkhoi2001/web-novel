import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { verifyNovelId } from "../middlewares/novel.js";
import {
    getFollow,
    createFollow,
    deleteFollow,
} from "../controllers/follow.js";

const router = express.Router({ mergeParams: true });

router.use(verifyUser);

router.get("/", getFollow);

router.use(verifyNovelId);

router.post("/", createFollow);
router.delete("/", deleteFollow);

export default router;
