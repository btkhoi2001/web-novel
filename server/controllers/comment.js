import { Comment } from "../models/Comment.js";

export const createComment = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { userId, parentCommentId, content } = req.body;

    if (!content)
        return res.status(400).json({ message: "content is required" });

    try {
        const newComment = new Comment({
            userId,
            novelId,
            chapterId,
            parentCommentId,
            content,
        });

        await newComment.save();

        res.status(201).json({
            message: "comment created successfully",
            newComment,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
