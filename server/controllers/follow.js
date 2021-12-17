import { Follow } from "../models/Follow.js";

export const getFollow = async (req, res) => {
    const { userId } = req.body;

    try {
        const follows = await Follow.aggregate([
            {
                $match: { userId: parseInt(userId) },
            },
            {
                $lookup: {
                    from: "novels",
                    localField: "novelId",
                    foreignField: "novelId",
                    as: "novel",
                },
            },
            {
                $unwind: {
                    path: "$novel",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$novelId",
                    novelTitle: "$novel.title",
                    cover: "$novel.cover",
                },
            },
        ]);

        res.status(200).json({ follows });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createFollow = async (req, res) => {
    const { userId, novelId } = req.body;

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

export const deleteFollow = async (req, res) => {
    const { novelId } = req.params;
    const { userId } = req.body;

    try {
        const deletedFollow = await Follow.findOneAndDelete(
            { userId, novelId },
            { lean: true }
        );

        res.status(200).json({ deletedFollow });
    } catch (error) {
        res.status(500).json({ error });
    }
};
