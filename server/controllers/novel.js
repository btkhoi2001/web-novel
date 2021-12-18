import { v4 as uuidv4 } from "uuid";
import { Novel } from "../models/Novel.js";
import { NovelRead } from "../models/NovelRead.js";
import { NovelCounter } from "../models/NovelCounter.js";
import { User } from "../models/User.js";
import { uploadFile } from "../config/aws/s3.js";

export const getNovel = async (req, res) => {
    try {
        const novels = await Novel.aggregate([
            {
                $match: { isArchived: false },
            },
            {
                $lookup: {
                    from: "ratings",
                    localField: "novelId",
                    foreignField: "novelId",
                    as: "rating",
                },
            },
            {
                $unwind: {
                    path: "$rating",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "novelcounters",
                    localField: "novelId",
                    foreignField: "novelId",
                    as: "novelcounter",
                },
            },
            {
                $group: {
                    _id: {
                        novelId: "$novelId",
                        title: "$title",
                        description: "$description",
                        novelcounter: "$novelcounter",
                        cover: "$cover",
                        authorId: "$authorId",
                        genres: "$genres",
                        isCompleted: "$isCompleted",
                    },
                    rating: { $avg: "$rating.rating" },
                    ratingCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    views: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: { $eq: ["$$this.name", "view"] },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$views",
                },
            },
            {
                $addFields: {
                    nominations: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: {
                                        $eq: ["$$this.name", "nomination"],
                                    },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$nominations",
                },
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: { $eq: ["$$this.name", "comment"] },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$comments",
                },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$_id.novelId",
                    title: "$_id.title",
                    description: "$_id.description",
                    views: "$views.count",
                    nominations: "$nominations.count",
                    comments: "$comments.count",
                    cover: "$_id.cover",
                    authorId: "$_id.authorId",
                    genres: "$_id.genres",
                    isCompleted: "$_id.isCompleted",
                    rating: { $ifNull: ["$rating", 0] },
                    ratingCount: "$ratingCount",
                },
            },
            {
                $sort: { novelId: 1 },
            },
        ]);

        res.status(200).json({ novels });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getNovelById = async (req, res) => {
    const { novelId } = req.params;
    const { userId } = req.user || {};

    try {
        const novel = await Novel.aggregate([
            {
                $match: { novelId: parseInt(novelId) },
            },
            {
                $lookup: {
                    from: "ratings",
                    localField: "novelId",
                    foreignField: "novelId",
                    as: "rating",
                },
            },
            {
                $unwind: {
                    path: "$rating",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "novelcounters",
                    localField: "novelId",
                    foreignField: "novelId",
                    as: "novelcounter",
                },
            },
            {
                $group: {
                    _id: {
                        novelId: "$novelId",
                        title: "$title",
                        description: "$description",
                        novelcounter: "$novelcounter",
                        cover: "$cover",
                        authorId: "$authorId",
                        genres: "$genres",
                        isCompleted: "$isCompleted",
                    },
                    rating: { $avg: "$rating.rating" },
                    ratingCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                        },
                    },
                },
            },
            {
                $addFields: {
                    views: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: { $eq: ["$$this.name", "view"] },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$views",
                },
            },
            {
                $addFields: {
                    nominations: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: {
                                        $eq: ["$$this.name", "nomination"],
                                    },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$nominations",
                },
            },
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$_id.novelcounter",
                                    cond: { $eq: ["$$this.name", "comment"] },
                                },
                            },
                            in: {
                                count: "$$this.daily",
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: "$comments",
                },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$_id.novelId",
                    title: "$_id.title",
                    description: "$_id.description",
                    cover: "$_id.cover",
                    views: "$views.count",
                    nominations: "$nominations.count",
                    comments: "$comments.count",
                    authorId: "$_id.authorId",
                    genres: "$_id.genres",
                    isCompleted: "$_id.isCompleted",
                    rating: { $ifNull: ["$rating", 0] },
                    ratingCount: "$ratingCount",
                },
            },
        ]);

        await NovelCounter.findOneAndUpdate(
            { novelId, name: "view" },
            {
                $inc: {
                    daily: 1,
                    weekly: 1,
                    monthly: 1,
                    all: 1,
                },
            },
            { lean: true, new: true }
        );

        if (userId)
            await NovelRead.findOneAndUpdate(
                { userId, novelId },
                { userId, novelId },
                { upsert: true, lean: true }
            );

        res.status(200).json({ novel });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNovel = async (req, res) => {
    const { title, description, genres } = req.body;
    const { userId } = req.user;
    const file = req.file;

    if (!title)
        return res.status(400).json({ message: "some fields are missing" });

    try {
        const newNovel = await Novel.create({
            title,
            description,
            authorId: userId,
            genres,
        });

        if (file) {
            const { originalname } = file;

            file.key =
                "cover/" +
                uuidv4() +
                originalname.substr(originalname.lastIndexOf("."));

            const uploadedFile = await uploadFile(file);

            newNovel.cover = uploadedFile.Location;
        }

        await NovelCounter.create([
            { novelId: newNovel.novelId, name: "view" },
            { novelId: newNovel.novelId, name: "nomination" },
            { novelId: newNovel.novelId, name: "comment" },
        ]);

        res.status(201).json({
            message: "novel created successfully",
            newNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateNovel = async (req, res) => {
    const { novelId } = req.params;
    const { title, description, genres, isCompleted } = req.body;
    const file = req.file;

    try {
        const updatedNovel = await Novel.findOneAndUpdate(
            { novelId },
            {
                title,
                description,
                genres,
                isCompleted,
            },
            { new: true }
        );

        if (file) {
            const { cover } = updatedNovel;

            if (cover) {
                file.key = cover.substr(cover.indexOf("cover/"));
                await uploadFile(file);
            } else {
                const { originalname } = file;

                file.key =
                    "cover/" +
                    uuidv4() +
                    originalname.substr(originalname.lastIndexOf("."));

                const uploadedFile = await uploadFile(file);

                updatedNovel.cover = uploadedFile.Location;
            }

            await updatedNovel.save();
        }

        res.status(200).json({
            message: "Novel updated successfully",
            updatedNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteNovel = async (req, res) => {
    const { novelId } = req.params;

    try {
        const deletedNovel = await Novel.findOneAndUpdate(
            { novelId },
            { isArchived: true },
            { lean: true, new: true }
        );
        // const { cover } = deletedNovel;

        // if (cover) {
        //     const key = cover.substr(cover.indexOf("cover/"));
        //     await deleteFile(key);
        // }

        res.status(200).json({
            message: "novel deleted successfully",
            deletedNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNomination = async (req, res) => {
    const { novelId } = req.params;
    const { quantity } = req.body;
    const { userId } = req.user;

    try {
        const user = await User.findOne({ userId });

        if (user.flowers < quantity)
            return res.status(403).json({ message: "not enough flowers" });

        const novelCounter = await NovelCounter.findOneAndUpdate(
            { novelId, name: "nomination" },
            {
                $inc: {
                    daily: quantity,
                    weekly: quantity,
                    monthly: quantity,
                    all: quantity,
                },
            },
            { lean: true, new: true }
        );

        user.flowers -= quantity;
        await user.save();

        res.status(200).json({ nominations: novelCounter.all });
    } catch (error) {
        res.status(500).json({ error });
    }
};
