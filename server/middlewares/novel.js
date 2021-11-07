import { User } from "../models/User.js";
import { Novel } from "../models/Novel.js";

export const verifyAuthor = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.body.userId });
        if (user.isAdmin) req.body.isAdmin = true;
        else if (!user.isAuthor)
            return res.status(401).json({
                message: "This user has no author permissions",
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyNovelId = async (req, res, next) => {
    const { novelId } = req.params;

    try {
        if (!(await Novel.exists({ novelId })))
            return res.status(404).json({
                message: `novelId ${novelId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyOwnership = async (req, res, next) => {
    const { userId } = req.body;
    const { novelId } = req.params;

    try {
        const novel = await Novel.findOne({ novelId });
        if (novel.authorId != userId && !req.body.isAdmin)
            return res.status(401).json({
                message: `this user has no permission to modify the novel has id ${novelId}`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
