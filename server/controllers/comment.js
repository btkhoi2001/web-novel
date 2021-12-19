import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";

export const getComment = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { parentCommentId } = req.query;
    const { userId } = req.user || {};

    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 12;

    try {
        const comments = (
            await Comment.aggregate([
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
                    $lookup: {
                        from: "comments",
                        localField: "commentId",
                        foreignField: "parentCommentId",
                        as: "childComment",
                    },
                },
                {
                    $unwind: {
                        path: "$childComment",
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
                        likes: {
                            $sum: {
                                $cond: [
                                    { $ifNull: ["$commentlike._id", false] },
                                    1,
                                    0,
                                ],
                            },
                        },
                        isLiked: {
                            $sum: {
                                $cond: [
                                    {
                                        $eq: [
                                            "$commentlike.userId",
                                            parseInt(userId),
                                        ],
                                    },
                                    1,
                                    0,
                                ],
                            },
                        },
                        childComments: {
                            $sum: {
                                $cond: [
                                    { $ifNull: ["$childComment._id", false] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: {
                                    _id: 0,
                                    commentId: "$_id.commentId",
                                    userId: "$_id.userId",
                                    displayName: "$_id.displayName",
                                    avatar: "$_id.avatar",
                                    content: "$_id.content",
                                    createdAt: "$_id.createdAt",
                                    likes: "$likes",
                                    isLiked: {
                                        $cond: [
                                            { $gte: ["$isLiked", 1] },
                                            true,
                                            false,
                                        ],
                                    },
                                    childComments: "$childComments",
                                },
                            },
                            {
                                $sort: { createdAt: 1 },
                            },
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: parseInt(limit),
                            },
                        ],
                        totalPages: [{ $count: "totalPages" }],
                    },
                },
            ])
        )[0];

        res.status(200).json({
            comments: comments.data,
            totalPages:
                comments.totalPages.length == 0
                    ? 0
                    : Math.ceil(comments.totalPages[0].totalPages / limit),
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createComment = async (req, res) => {
    const { novelId, chapterId } = req.params;
    const { parentCommentId, content } = req.body;
    const { userId } = req.user;

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
    const { commentId } = req.params;
    const { userId } = req.user;

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
    const { commentId } = req.params;
    const { userId } = req.user;

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
