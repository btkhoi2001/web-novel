import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";
import { Novel } from "../models/Novel.js";
import { Chapter } from "../models/Chapter.js";

export const getComment = async (req, res) => {
    const { novelId, chapterId, parentCommentId } = req.query;
    const { userId } = req.user || {};
    const matchQuery = {};
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    if (novelId) matchQuery.novelId = parseInt(novelId);

    matchQuery.chapterId = chapterId ? parseInt(chapterId) : null;
    matchQuery.parentCommentId = parentCommentId
        ? parseInt(parentCommentId)
        : null;

    try {
        const comments = (
            await Comment.aggregate([
                {
                    $match: matchQuery,
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
                            $addToSet: "$commentlike._id",
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
                            $addToSet: "$childComment._id",
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
                                    likes: { $size: "$likes" },
                                    isLiked: {
                                        $cond: [
                                            { $gte: ["$isLiked", 1] },
                                            true,
                                            false,
                                        ],
                                    },
                                    childComments: { $size: "$childComments" },
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
    const { novelId, chapterId, parentCommentId, content } = req.body;
    const { userId } = req.user;

    if (novelId && !(await Novel.exists({ novelId, isArchived: false })))
        return res.status(404).json({
            message: `novelId ${novelId} not found`,
        });

    if (
        chapterId &&
        !(await Chapter.exists({ novelId, chapterId, isArchived: false }))
    )
        return res.status(404).json({
            message: `chapterId ${chapterId} not found`,
        });

    if (
        parentCommentId &&
        !(await Comment.exists({ commentId: parentCommentId }))
    )
        return res.status(404).json({
            message: `parentCommendId ${parentCommendId} not found`,
        });

    if (!content || (!novelId && !chapterId && !parentCommentId))
        return res.status(400).json({ message: "some fields are missing" });

    try {
        const newComment = await Comment.create({
            userId,
            novelId,
            chapterId,
            parentCommentId,
            content,
        });

        res.status(201).json({ newComment });
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
