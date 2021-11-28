import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { createRating } from "../controllers/rating.js";
const router = express.Router({ mergeParams: true });

router.post("/", verifyToken, createRating);

export default router;
