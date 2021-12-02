import { Comment } from "../models/Comment.js";

export const verifyCommentId = async (req, res, next) => {
    const { commentId } = req.params;

    try {
        if (!(await Comment.exists({ commentId})))
            return res.status(404).json({
                message: `commentId ${commentId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
