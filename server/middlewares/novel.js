import { Novel } from "../models/Novel.js";

export const verifyNovelId = async (req, res, next) => {
    const novelId = req.params.novelId || req.body.novelId;

    try {
        if (!(await Novel.exists({ novelId, isArchived: false })))
            return res.status(404).json({
                message: `novelId ${novelId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyNovelOwnership = async (req, res, next) => {
    const { userId } = req.user;
    const { novelId } = req.params;

    try {
        const novel = await Novel.findOne({ novelId });

        if (novel.authorId != userId)
            return res.status(401).json({
                message: `this user has no permission to modify this novel`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
