import { Bookmark } from "../models/Bookmark.js";

export const getBookmark = async (req, res) => {
    const { userId } = req.user;

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
                    bookmarkId: "$bookmarkId",
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
    const { novelId, chapterId } = req.body;
    const { userId } = req.user;

    console.log(userId, novelId, chapterId);

    try {
        let newBookmark = await Bookmark.findOne(
            { userId, novelId, chapterId },
            {},
            { lean: true }
        );

        if (!newBookmark) {
            newBookmark = new Bookmark({
                userId,
                novelId,
                chapterId,
            });

            await newBookmark.save();
        }

        res.status(201).json({ newBookmark });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteBookmark = async (req, res) => {
    const { novelId, chapterId } = req.body;
    const { userId } = req.user;

    try {
        const deletedBookmark = await Bookmark.findOneAndDelete(
            {
                userId,
                novelId,
                chapterId,
            },
            { lean: true }
        );

        res.status(200).json({ deletedBookmark });
    } catch (error) {
        res.status(500).json({ error });
    }
};
