import { Rating } from "../models/Rating.js";

export const createRating = async (req, res) => {
    const { novelId } = req.params;
    const { userId, rating } = req.body;

    try {
        const newRating = new Rating({
            userId,
            novelId,
            rating,
        });

        res.status(201).json({ newRating });
    } catch (error) {
        res.status(500).json({ error });
    }
};
