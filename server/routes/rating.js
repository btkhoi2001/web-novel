import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import { createRating } from "../controllers/rating.js";

const router = express.Router({ mergeParams: true });

router.post("/", verifyUser, createRating);

export default router;
