import { Chapter } from "../models/Chapter.js";

export const getChapter = async (req, res) => {
    const { novelId } = req.params;

    try {
        const chapters = await Chapter.find(
            { novelId },
            { _id: 0, content: 0, novelId: 0 }
        );

        res.status(200).json({ chapters });
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

        res.status(201).json({ newChapter });
    } catch (error) {
        res.status(500).json({ error });
    }
};
