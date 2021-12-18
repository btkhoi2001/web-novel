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
    const { userId } = req.body;
    const { novelId } = req.params;
    console.log("verifyNovelOwnership");

    try {
        const novel = await Novel.findOne({ novelId });

        if (novel.authorId != userId)
            return res.status(401).json({
                message: `this user has no permission to modify the novel has id ${novelId}`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
