import { v4 as uuidv4 } from "uuid";
import { Novel } from "../models/Novel.js";
import { NovelRead } from "../models/NovelRead.js";
import { NovelCounter } from "../models/NovelCounter.js";
import { User } from "../models/User.js";
import { Genre } from "../models/Genre.js";
import { uploadFile } from "../config/aws/s3.js";

export const getNovel = async (req, res) => {
    let {
        page,
        limit,
        authorId,
        sortBy,
        timeline,
        genreId,
        completed,
        chapterMin,
        chapterMax,
    } = req.query;

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    const preMatch = { isArchived: false };
    const postMatch = {};
    const sortField = {};
    let count = { count: "$$this.all" };

    if (authorId) preMatch.authorId = parseInt(authorId);

    if (genreId) {
        genreId = genreId.map(Number);
        preMatch.genreId = { $in: genreId };
    }

    if (typeof completed != "undefined")
        preMatch.isCompleted = completed == "true" ? true : false;

    if (chapterMin && chapterMax)
        postMatch.$and = [
            { chapters: { $gte: parseInt(chapterMin) } },
            { chapters: { $lte: parseInt(chapterMax) } },
        ];
    else if (chapterMin) postMatch.chapters = { $gte: parseInt(chapterMin) };
    else if (chapterMax) postMatch.chapters = { $lte: parseInt(chapterMax) };

    if (sortBy) {
        switch (sortBy) {
            case "new":
                sortField.createdAt = -1;
                break;
            case "view":
                sortField.views = -1;
                break;
            case "nomination":
                sortField.nominations = -1;
                break;
            case "comment":
                sortField.comments = -1;
                break;
            case "rating":
                sortField.rating = -1;
                break;
            default:
                sortField.title = 1;
        }
    } else sortField.novelId = 1;

    if (timeline) {
        switch (timeline) {
            case "daily":
                count = { count: "$$this.daily" };
                break;
            case "weekly":
                count = { count: "$$this.weekly" };
                break;
            case "monthly":
                count = { count: "$$this.monthly" };
                break;
            default:
                count = { count: "$$this.all" };
        }
    }

    try {
        const novels = (
            await Novel.aggregate([
                {
                    $match: preMatch,
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
                        from: "novelcounters",
                        localField: "novelId",
                        foreignField: "novelId",
                        as: "novelcounter",
                    },
                },
                {
                    $sort: { "chapter.createdAt": 1 },
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
                            genre: "$genre",
                            genreId: "$genreId",
                            isCompleted: "$isCompleted",
                        },
                        rating: { $avg: "$rating.rating" },
                        ratingCount: {
                            $sum: {
                                $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                            },
                        },
                        chapters: {
                            $sum: {
                                $cond: [{ $ifNull: ["$chapter", false] }, 1, 0],
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
                                in: count,
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
                                in: count,
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
                                        cond: {
                                            $eq: ["$$this.name", "comment"],
                                        },
                                    },
                                },
                                in: count,
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
                    $facet: {
                        data: [
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
                                    genre: "$_id.genre",
                                    genreId: "$_id.genreId",
                                    isCompleted: "$_id.isCompleted",
                                    rating: { $ifNull: ["$rating", 0] },
                                    ratingCount: "$ratingCount",
                                    chapters: { $ifNull: ["$chapters", 0] },
                                },
                            },
                            {
                                $match: postMatch,
                            },
                            {
                                $sort: sortField,
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

export const getNovelGenre = async (req, res) => {
    try {
        const genres = await Genre.find(
            {},
            { _id: 0, genreId: 1, name: 1 },
            { lean: true }
        );

        return res.status(200).json({ genres });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getNovelById = async (req, res) => {
    const { novelId } = req.params;
    const { userId } = req.user || {};

    try {
        const novel = (
            await Novel.aggregate([
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
                            genre: "$genre",
                            genreId: "$genreId",
                            isCompleted: "$isCompleted",
                        },
                        rating: { $avg: "$rating.rating" },
                        ratingCount: {
                            $sum: {
                                $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                            },
                        },
                        chapters: {
                            $sum: {
                                $cond: [{ $ifNull: ["$chapter", false] }, 1, 0],
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
                                        cond: {
                                            $eq: ["$$this.name", "comment"],
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
                        genre: "$_id.genre",
                        genreId: "$_id.genreId",
                        isCompleted: "$_id.isCompleted",
                        rating: { $ifNull: ["$rating", 0] },
                        ratingCount: "$ratingCount",
                        chapters: { $ifNull: ["$chapters", 0] },
                    },
                },
            ])
        )[0];

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
    const { title, description, genreId } = req.body;
    const { userId } = req.user;
    const file = req.file;

    if (!title)
        return res.status(400).json({ message: "some fields are missing" });

    try {
        const genre = await Genre.findOne({ genreId }, {}, { lean: true });

        const query = {
            title,
            description,
            authorId: userId,
        };

        if (genre) {
            query.genreId = genreId;
            query.genre = genre.name;
        }

        const newNovel = await Novel.create(query);

        if (file) {
            const { originalname } = file;

            file.key =
                "cover/" +
                uuidv4() +
                originalname.substr(originalname.lastIndexOf("."));

            const uploadedFile = await uploadFile(file);

            newNovel.cover = uploadedFile.Location;
            newNovel.save();
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
    const { title, description, genreId, isCompleted } = req.body;
    const file = req.file;

    try {
        const genre = await Genre.findOne({ genreId }, {}, { lean: true });

        const query = {
            title,
            description,
            isCompleted,
        };

        if (genre) {
            query.genreId = genreId;
            query.genre = genre.name;
        }

        const updatedNovel = await Novel.findOneAndUpdate({ novelId }, query, {
            new: true,
        });

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
