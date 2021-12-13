import { Rating } from "../models/Rating.js";

export const createRating = async (req, res) => {
    const { userId, rating } = req.body;
    const { novelId } = req.params;

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
