import { v4 as uuidv4 } from "uuid";
import { Novel } from "../models/Novel.js";
import { Rating } from "../models/Rating.js";
import { uploadFile, deleteFile } from "../config/aws/s3.js";

export const getNovel = async (req, res) => {
    try {
        // const novels = await Novel.find(null, null, { lean: true });
        const novels = await Novel.aggregate([
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
                $group: {
                    _id: {
                        novelId: "$novelId",
                        title: "$title",
                        description: "$description",
                        views: "$views",
                        nominations: "$nominations",
                        cover: "$cover",
                        authorId: "$authorId",
                        genres: "$genres",
                        isCompleted: "$isCompleted",
                    },
                    rating: { $avg: "$rating.rating" },
                },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$_id.novelId",
                    title: "$_id.title",
                    description: "$_id.description",
                    views: "$_id.views",
                    nominations: "$_id.nominations",
                    cover: "$_id.cover",
                    authorId: "$_id.authorId",
                    genres: "$_id.genres",
                    isCompleted: "$_id.isCompleted",
                    rating: { $ifNull: ["$rating", 0] },
                },
            },
            {
                $sort: { novelId: 1 },
            },
        ]);

        console.log(novels);

        res.status(200).json({ novels });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getNovelById = async (req, res) => {
    const { novelId } = req.params;

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
                $group: {
                    _id: {
                        novelId: "$novelId",
                        title: "$title",
                        description: "$description",
                        views: "$views",
                        nominations: "$nominations",
                        cover: "$cover",
                        authorId: "$authorId",
                        genres: "$genres",
                        isCompleted: "$isCompleted",
                    },
                    rating: { $avg: "$rating.rating" },
                },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$_id.novelId",
                    title: "$_id.title",
                    description: "$_id.description",
                    views: "$_id.views",
                    nominations: "$_id.nominations",
                    cover: "$_id.cover",
                    authorId: "$_id.authorId",
                    genres: "$_id.genres",
                    isCompleted: "$_id.isCompleted",
                    rating: { $ifNull: ["$rating", 0] },
                },
            },
        ]);

        console.log(novel);

        res.status(200).json({ novel });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNovel = async (req, res) => {
    const { userId, title, description, genres } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    try {
        const file = req.file;
        const { originalname } = file;
        file.key =
            "cover/" +
            uuidv4() +
            originalname.substr(originalname.lastIndexOf("."));
        const uploadedFile = await uploadFile(file);

        const newNovel = new Novel({
            title,
            description,
            cover: uploadedFile.Location,
            authorId: userId,
            genres,
        });

        await newNovel.save();

        res.status(201).json({
            message: "Novel created successfully",
            newNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateNovel = async (req, res) => {
    const { novelId } = req.params;
    const { title, description, genres, isComplete } = req.body;

    try {
        const updatedNovel = await Novel.findOneAndUpdate(
            { novelId },
            {
                title,
                description,
                genres,
                isComplete,
            },
            { new: true }
        );

        const file = req.file;
        const { cover } = updatedNovel;
        file.key = cover.substr(cover.indexOf("cover/"));
        await uploadFile(file);

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
        const deletedNovel = await Novel.findOneAndDelete({ novelId });
        const { cover } = deletedNovel;
        const key = cover.substr(cover.indexOf("cover/"));

        await deleteFile(key);

        res.status(200).json({
            message: "novel deleted successfully",
            deletedNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createRatingNovel = async (req, res) => {
    const { userId, rating } = req.body;
    const { novelId } = req.params;

    if (!rating) return res.status(401).json({ message: "rating not found" });

    try {
        const newRatingNovel = await Rating.findOneAndUpdate(
            { userId, novelId },
            { userId, novelId, rating },
            { upsert: true, lean: true, new: true }
        );

        return res.status(201).json({ newRatingNovel });
    } catch (error) {
        res.status(500).json({ error });
    }
};
