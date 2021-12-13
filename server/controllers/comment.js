import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";

export const getComment = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { parentCommentId } = req.query;

    try {
        const comments = await Comment.aggregate([
            {
                $match: {
                    novelId: parseInt(novelId),
                    chapterId: parseInt(chapterId) || null,
                    parentCommentId: parseInt(parentCommentId) || null,
                },
            },
            {
                $lookup: {
                    from: "commentlikes",
                    localField: "commentId",
                    foreignField: "commentId",
                    as: "commentlike",
                },
            },
            {
                $unwind: {
                    path: "$commentlike",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: {
                        commentId: "$commentId",
                        userId: "$user.userId",
                        displayName: "$user.displayName",
                        avatar: "$user.avatar",
                        content: "$content",
                        createdAt: "$createdAt",
                    },
                    likeCount: {
                        $sum: {
                            $cond: [{ $ifNull: ["$commentlike", false] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    commentId: "$_id.commentId",
                    userId: "$_id.userId",
                    displayName: "$_id.displayName",
                    avatar: "$_id.avatar",
                    content: "$_id.content",
                    createdAt: "$_id.createdAt",
                    likeCount: "$likeCount",
                },
            },
            {
                $sort: { commentId: 1 },
            },
        ]);

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

export const createCommentLike = async (req, res) => {
    const { userId } = req.body;
    const { commentId } = req.params;

    try {
        const newCommentLike = await CommentLike.findOneAndUpdate(
            {
                userId,
                commentId,
            },
            {
                userId,
                commentId,
            },
            { upsert: true, lean: true, new: true }
        );

        return res.status(201).json({ newCommentLike });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteCommentLike = async (req, res) => {
    const { userId } = req.body;
    const { commentId } = req.params;

    try {
        const deletedCommentLike = await CommentLike.findOneAndDelete(
            {
                userId,
                commentId,
            },
            { lean: true }
        );

        res.status(200).json({ deletedCommentLike });
    } catch (error) {
        res.status(500).json({ error });
    }
};
