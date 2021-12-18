import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";
import { Novel } from "../models/Novel.js";

export const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = (
            await User.aggregate([
                {
                    $match: { userId: parseInt(userId) },
                },
                {
                    $lookup: {
                        from: "chapterreads",
                        localField: "userId",
                        foreignField: "userId",
                        as: "chapterread",
                    },
                },
                {
                    $unwind: {
                        path: "$chapterread",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "novels",
                        localField: "userId",
                        foreignField: "authorId",
                        as: "novel",
                    },
                },
                {
                    $unwind: {
                        path: "$novel",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "chapters",
                        localField: "novel.novelId",
                        foreignField: "novelId",
                        as: "chapter",
                    },
                },
                {
                    $unwind: {
                        path: "$chapter",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: {
                            displayName: "$displayName",
                            avatar: "$avatar",
                            description: "$description",
                            gender: "$gender",
                            flowers: "$flowers",
                            joinedAt: "$createdAt",
                        },
                        chapterRead: {
                            $sum: {
                                $cond: [
                                    { $ifNull: ["$chapterread", false] },
                                    1,
                                    0,
                                ],
                            },
                        },
                        novelPublished: {
                            $sum: {
                                $cond: [{ $ifNull: ["$novel", false] }, 1, 0],
                            },
                        },
                        chapterPublished: {
                            $sum: {
                                $cond: [{ $ifNull: ["$chapter", false] }, 1, 0],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        displayName: "$_id.displayName",
                        avatar: "$_id.avatar",
                        description: "$_id.description",
                        gender: "$_id.gender",
                        flowers: "$_id.flowers",
                        joinedAt: "$_id.joinedAt",
                        chapterRead: "$chapterRead",
                        novelPublished: "$novelPublished",
                        chapterPublished: "$chapterPublished",
                    },
                },
            ])
        )[0];

        const commentCount = (
            await Comment.aggregate([
                {
                    $match: { userId: parseInt(userId) },
                },
                {
                    $group: {
                        _id: 1,
                        commentCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        commentCount: "$commentCount",
                    },
                },
            ])
        )[0];

        const nominationCount = (
            await Novel.aggregate([
                {
                    $lookup: {
                        from: "novelcounters",
                        localField: "novelId",
                        foreignField: "novelId",
                        as: "novelcounter",
                    },
                },
                {
                    $unwind: {
                        path: "$novelcounter",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        authorId: parseInt(userId),
                        "novelcounter.name": "nomination",
                    },
                },
                {
                    $group: {
                        _id: 1,
                        nominationCount: { $sum: "$novelcounter.all" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        nominationCount: "$nominationCount",
                    },
                },
            ])
        )[0];

        const likeCount = (
            await CommentLike.aggregate([
                {
                    $lookup: {
                        from: "comments",
                        localField: "commentId",
                        foreignField: "commentId",
                        as: "comment",
                    },
                },
                {
                    $unwind: {
                        path: "$comment",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: { "comment.userId": parseInt(userId) },
                },
                {
                    $group: {
                        _id: 1,
                        likeCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        likeCount: "$likeCount",
                    },
                },
            ])
        )[0];

        user.commentCount = commentCount ? commentCount.commentCount : 0;
        user.nominationCount = nominationCount
            ? nominationCount.nominationCount
            : 0;
        user.likeCount = likeCount ? likeCount.likeCount : 0;

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateUserProfile = async (req, res) => {
    // const {displayName, avatar,} = req.body;
};
