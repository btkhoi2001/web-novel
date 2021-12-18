import { Chapter } from "../models/Chapter.js";

export const verifyChapterId = async (req, res, next) => {
    const novelId = req.params.novelId || req.body.novelId;
    const chapterId = req.params.chapterId || req.body.chapterId;

    try {
        if (!(await Chapter.exists({ novelId, chapterId, isArchived: false })))
            return res.status(404).json({
                message: `chapterId ${chapterId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
