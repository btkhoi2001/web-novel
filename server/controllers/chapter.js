import { Chapter } from "../models/Chapter.js";

export const getChapter = async (req, res) => {
    const { novelId } = req.params;

    try {
        const chapters = await Chapter.find({ novelId }, { content: 0 });

        res.status(200).json({ chapters });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getChapterById = async (req, res) => {
    const { novelId, chapterId } = req.params;

    try {
        const chapter = await Chapter.findOne({ novelId, chapterId });

        res.status(200).json({ chapter });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createChapter = async (req, res) => {
    const { novelId } = req.params;
    const { title, content } = req.body;

    try {
        const newChapter = new Chapter({
            title,
            content,
            novelId,
        });

        await newChapter.save();

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
    const { title, content } = req.body;

    try {
        const updatedChapter = await Chapter.findOneAndUpdate(
            {
                novelId,
                chapterId,
            },
            {
                title,
                content,
            },
            { new: true }
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
        const deletedChapter = await Chapter.findOneAndDelete({
            novelId,
            chapterId,
        });

        res.status(200).json({
            message: "chapter deleted successfully",
            deletedChapter,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
