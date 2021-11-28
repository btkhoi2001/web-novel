import { Comment } from "../models/Comment.js";

export const getComment = async (req, res) => {
    const { novelId, chapterId } = req.params;

    try {
        const comments = await Comment.find({ novelId, chapterId });

        res.status(200).json({ comments });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createComment = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { userId, parentCommentId, content } = req.body;

    if (!content)
        return res.status(400).json({ message: "content is required" });

    try {
        console.log(1);
        const newComment = new Comment({
            userId,
            novelId,
            chapterId,
            parentCommentId,
            content,
        });

        console.log(2);
        console.log(newComment);
        await newComment.save();
        console.log(3);

        res.status(201).json({
            message: "comment created successfully",
            newComment,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
