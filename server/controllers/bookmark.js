import { Bookmark } from "../models/Bookmark.js";

export const getBookmark = async (req, res) => {
    const { userId } = req.body;

    try {
        const bookmarks = await Bookmark.aggregate([
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
                    localField: "chapterId",
                    foreignField: "chapterId",
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
                $project: {
                    _id: 0,
                    novelId: "$novelId",
                    novelTitle: "$novel.title",
                    cover: "$novel.cover",
                    chapterOrder: "$chapter.chapterOrder",
                    chapterTitle: "$chapter.title",
                },
            },
        ]);

        res.status(200).json({ bookmarks });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createBookmark = async (req, res) => {
    const { userId, novelId, chapterId } = req.body;

    try {
        const newBookmark = await Bookmark.findOneAndUpdate(
            { userId, novelId, chapterId },
            { userId, novelId, chapterId },
            { upsert: true, lean: true, new: true }
        );

        res.status(201).json({ newBookmark });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteBookmark = async (req, res) => {
    const { userId, novelId } = req.body;

    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({
            userId,
            novelId,
        });

        res.status(200).json({ deletedBookmark });
    } catch (error) {
        res.status(500).json({ error });
    }
};
