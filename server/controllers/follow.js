import { Follow } from "../models/Follow.js";

export const createFollow = async (req, res) => {
    const { novelId } = req.params;
    const { userId } = req.body;

    try {
        const newFollow = await Follow.findOneAndUpdate(
            { userId, novelId },
            { userId, novelId },
            { upsert: true, lean: true, new: true }
        );

        res.status(201).json({ newFollow });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteFollow = async (req, res) => {};
