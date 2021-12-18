import { Rating } from "../models/Rating.js";

export const createRating = async (req, res) => {
    const { rating } = req.body;
    const { novelId } = req.params;
    const { userId } = req.user;

    if (!rating) return res.status(401).json({ message: "rating not found" });

    try {
        const newRating = await Rating.findOneAndUpdate(
            { userId, novelId },
            { userId, novelId, rating },
            { upsert: true, lean: true, new: true }
        );

        return res.status(201).json({ newRating });
    } catch (error) {
        res.status(500).json({ error });
    }
};
