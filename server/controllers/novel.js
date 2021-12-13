import { v4 as uuidv4 } from "uuid";
import { Novel } from "../models/Novel.js";
import { uploadFile, deleteFile } from "../config/aws/s3.js";

export const getNovel = async (req, res) => {
    try {
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
                    ratingCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                        },
                    },
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
                    ratingCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$rating", false] }, 1, 0],
                        },
                    },
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
                    ratingCount: "$ratingCount",
                },
            },
        ]);

        res.status(200).json({ novel });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNovel = async (req, res) => {
    const { userId, title, description, genres } = req.body;
    const file = req.file;

    if (!title)
        return res.status(400).json({ message: "some fields are missing" });

    try {
        const newNovel = new Novel({
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
        const deletedNovel = await Novel.findOneAndDelete(
            { novelId },
            { lean: true }
        );
        const { cover } = deletedNovel;

        if (cover) {
            const key = cover.substr(cover.indexOf("cover/"));
            await deleteFile(key);
        }

        res.status(200).json({
            message: "novel deleted successfully",
            deletedNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
