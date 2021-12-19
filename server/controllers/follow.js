import { Follow } from "../models/Follow.js";

export const getFollow = async (req, res) => {
    const { userId } = req.user;
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    try {
        const follows = (
            await Follow.aggregate([
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
                    $lookup: {
                        from: "chapters",
                        let: {
                            novelId: "$novelId",
                            isArchived: false,
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$novelId", "$$novelId"],
                                            },
                                            {
                                                $eq: [
                                                    "$isArchived",
                                                    "$$isArchived",
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "chapter",
                    },
                },
                {
                    $unwind: {
                        path: "$chapter",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "chapterreads",
                        let: {
                            userId: parseInt(userId),
                            chapterId: "$chapter.chapterId",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ["$userId", "$$userId"],
                                            },
                                            {
                                                $eq: [
                                                    "$chapterId",
                                                    "$$chapterId",
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "chapterread",
                    },
                },
                {
                    $unwind: {
                        path: "$chapterread",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: {
                            novelId: "$novelId",
                            novelTitle: "$novel.title",
                            cover: "$novel.cover",
                        },
                        chapters: {
                            $sum: {
                                $cond: [{ $ifNull: ["$chapter", false] }, 1, 0],
                            },
                        },
                        readChapters: {
                            $sum: {
                                $cond: [
                                    { $ifNull: ["$chapterread", false] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: {
                                    _id: 0,
                                    novelId: "$_id.novelId",
                                    novelTitle: "$_id.novelTitle",
                                    cover: "$_id.cover",
                                    chapters: "$chapters",
                                    readChapters: "$readChapters",
                                },
                            },
                            {
                                $sort: { novelId: 1 },
                            },
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: parseInt(limit),
                            },
                        ],
                        totalPages: [{ $count: "totalPages" }],
                    },
                },
            ])
        )[0];

        res.status(200).json({
            follows: follows.data,
            totalPages:
                follows.totalPages.length == 0
                    ? 0
                    : Math.ceil(follows.totalPages[0].totalPages / limit),
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createFollow = async (req, res) => {
    const { novelId } = req.body;
    const { userId } = req.user;

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
    const { userId } = req.user;

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
