import { User } from "../models/User.js";
import { Novel } from "../models/Novel.js";
import { Chapter } from "../models/Chapter.js";
import { Notification } from "../models/Notification.js";

export const getUser = async (req, res) => {
    let { page, limit, userId, isBlocked, isVerified, isAuthor, search } =
        req.query;
    const matchQuery = {};

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    if (userId) matchQuery.userId = parseInt(userId);
    if (isBlocked) matchQuery.isBlocked = isBlocked == "false" ? false : true;
    if (isVerified)
        matchQuery.isVerified = isVerified == "false" ? false : true;
    if (isAuthor) matchQuery.role = "Author";
    if (search) matchQuery.$text = { $search: search };

    try {
        const users = (
            await User.aggregate([
                {
                    $match: matchQuery,
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: {
                                    _id: 0,
                                    password: 0,
                                },
                            },
                            {
                                $sort: { userId: 1 },
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
            users: users.data,
            totalPages:
                users.totalPages.length == 0
                    ? 0
                    : Math.ceil(users.totalPages[0].totalPages / limit),
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateUser = async (req, res) => {
    const { userId, isBlocked, role } = req.body;
    const updatedField = {};

    if (isBlocked) updatedField.isBlocked = isBlocked == "false" ? false : true;
    if (role == "Reader" || role == "Author") updatedField.role = role;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            updatedField,
            {
                lean: true,
                new: true,
            }
        ).select({
            password: 0,
        });

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getNovel = async (req, res) => {
    let { page, limit, novelId, isArchived, search } = req.query;
    const matchQuery = {};

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    if (novelId) matchQuery.novelId = parseInt(novelId);
    if (isArchived)
        matchQuery.isArchived = isArchived == "false" ? false : true;
    if (search) matchQuery.$text = { $search: search };

    try {
        const novels = (
            await Novel.aggregate([
                {
                    $match: matchQuery,
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: { _id: 0 },
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
            novels: novels.data,
            totalPages:
                novels.totalPages.length == 0
                    ? 0
                    : Math.ceil(novels.totalPages[0].totalPages / limit),
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateNovel = async (req, res) => {
    const { novelId, isArchived } = req.body;
    const updatedField = {};

    if (isArchived)
        updatedField.isArchived = isArchived == "false" ? false : true;

    try {
        const updatedNovel = await Novel.findOneAndUpdate(
            { novelId },
            updatedField,
            {
                lean: true,
                new: true,
            }
        );

        res.status(200).json({ updatedNovel });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getChapter = async (req, res) => {
    let { page, limit, novelId, chapterId, isArchived, search } = req.query;
    const matchQuery = {};

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    if (novelId) matchQuery.novelId = parseInt(novelId);
    if (chapterId) matchQuery.chapterId = parseInt(chapterId);
    if (isArchived)
        matchQuery.isArchived = isArchived == "false" ? false : true;
    if (search) matchQuery.$text = { $search: search };

    try {
        const chapters = (
            await Chapter.aggregate([
                {
                    $match: matchQuery,
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: { _id: 0 },
                            },
                            {
                                $sort: { chapterId: 1 },
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
            chapters: chapters.data,
            totalPages:
                chapters.totalPages.length == 0
                    ? 0
                    : Math.ceil(chapters.totalPages[0].totalPages / limit),
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateChapter = async (req, res) => {
    const { chapterId, isArchived } = req.body;
    const updatedField = {};

    if (isArchived)
        updatedField.isArchived = isArchived == "false" ? false : true;

    try {
        const updatedChapter = await Chapter.findOneAndUpdate(
            { chapterId },
            updatedField,
            {
                lean: true,
                new: true,
            }
        );

        res.status(200).json({ updatedChapter });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNotification = async (req, res) => {
    const { receiverId, title, message } = req.body;
    const matchQuery = {};

    if (receiverId) matchQuery.userId = parseInt(receiverId);

    try {
        const notifications = await User.aggregate([
            {
                $match: matchQuery,
            },
            {
                $project: {
                    _id: 0,
                    receiverId: "$userId",
                    title: title,
                    message: message,
                },
            },
        ]);

        await Notification.create(notifications);

        res.status(200).json({ message: "notifications created successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};
