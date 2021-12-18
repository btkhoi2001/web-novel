import { Chapter } from "../models/Chapter.js";
import { ChapterRead } from "../models/ChapterRead.js";
import { Novel } from "../models/Novel.js";
import { Follow } from "../models/Follow.js";
import { Notification } from "../models/Notification.js";

export const getChapter = async (req, res) => {
    const { novelId } = req.params;

    try {
        const chapters = await Chapter.find(
            { novelId, isArchived: true },
            { content: 0 }
        );

        res.status(200).json({ chapters });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getChapterById = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { userId } = req.user;

    try {
        const chapter = await Chapter.findOne({ novelId, chapterId });

        if (userId)
            await ChapterRead.findOneAndUpdate(
                { userId, novelId, chapterId },
                { userId, novelId, chapterId },
                { upsert: true, lean: true }
            );

        res.status(200).json({ chapter });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createChapter = async (req, res) => {
    const { novelId } = req.params;
    const { chapterOrder, title, content } = req.body;

    if (!chapterOrder || !title || !content)
        return res.status(400).json({ message: "some fields are missing" });

    try {
        const newChapter = new Chapter({
            chapterOrder,
            title,
            content,
            novelId,
        });

        await newChapter.save();

        const novel = await Novel.findOne(
            { novelId },
            { _id: 0, title: 1, cover: 1 },
            { lean: true }
        );

        const notifications = await Follow.aggregate([
            {
                $match: { novelId: parseInt(novelId) },
            },
            {
                $project: {
                    _id: 0,
                    receiverId: "$userId",
                    title: `${novel.title} vừa thêm Chương ${chapterOrder}: ${title}`,
                    image: novel.cover,
                    actionUrl: `/novel/${novelId}/chapter/${newChapter.chapterId}`,
                },
            },
        ]);

        await Notification.create(notifications);

        res.status(201).json({
            message: "chapter created successfully",
            newChapter,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateChapter = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { chapterOrder, title, content } = req.body;

    try {
        const updatedChapter = await Chapter.findOneAndUpdate(
            {
                novelId,
                chapterId,
            },
            {
                chapterOrder,
                title,
                content,
            },
            { lean: true, new: true }
        );

        res.status(200).json({
            message: "Chapter updated successfully",
            updatedChapter,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteChapter = async (req, res) => {
    const { novelId, chapterId } = req.params;

    try {
        const deletedChapter = await Chapter.findOneAndDelete(
            {
                novelId,
                chapterId,
            },
            {
                lean: true,
            }
        );

        res.status(200).json({
            message: "chapter deleted successfully",
            deletedChapter,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
