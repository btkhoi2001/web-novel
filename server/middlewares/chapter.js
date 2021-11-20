import { Chapter } from "../models/Chapter.js";

export const verifyChapterId = async (req, res, next) => {
    const { novelId, chapterId } = req.params;

    try {
        if (!(await Chapter.exists({ novelId, chapterId })))
            return res.status(404).json({
                message: `chapterId ${chapterId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
