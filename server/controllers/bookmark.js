import { Bookmark } from "../models/Bookmark.js";

export const createBookmark = async (req, res) => {
    const { userId, novelId } = req.body;

    try {
        const newBookmark = await Bookmark.findOneAndUpdate(
            { userId, novelId },
            { userId, novelId },
            { upsert: true, lean: true, new: true }
        );

        res.status(201).json({ newBookmark });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteBookmark = async (req, res) => {};
