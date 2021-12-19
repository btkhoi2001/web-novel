import { v4 as uuidv4 } from "uuid";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { uploadFile } from "../config/aws/s3.js";
import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js";
import { CommentLike } from "../models/CommentLike.js";
import { Novel } from "../models/Novel.js";
import { NovelRead } from "../models/NovelRead.js";
import { InvalidToken } from "../models/InvalidToken.js";

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
                            createdAt: "$createdAt",
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
                        createdAt: "$_id.createdAt",
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

export const getUserRecentRead = async (req, res) => {
    const { userId } = req.params;

    try {
        const novels = await NovelRead.aggregate([
            {
                $match: { userId: parseInt(userId) },
            },
            {
                $lookup: {
                    from: "novels",
                    localField: "novelId",
                    foreignField: "novelId",
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
                $sort: { updatedAt: -1 },
            },
            {
                $project: {
                    _id: 0,
                    novelId: "$novelId",
                    title: "$novel.title",
                    description: "$novel.description",
                    cover: "$novel.cover",
                },
            },
            {
                $limit: 10,
            },
        ]);

        res.status(200).json({ novels });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getUserAccount = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findOne(
            { userId },
            {
                _id: 0,
                displayName: 1,
                email: 1,
                avatar: 1,
                description: 1,
                gender: 1,
                flowers: 1,
            }
        );

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateUserAccount = async (req, res) => {
    const { displayName, description, gender } = req.body;
    const { userId } = req.user;
    const file = req.file;

    console.log(displayName, description, gender);

    try {
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            {
                displayName,
                description,
                gender,
            },
            {
                new: true,
            }
        ).select({
            displayName: 1,
            description: 1,
            gender: 1,
            avatar: 1,
        });

        console.log(updatedUser);

        if (file) {
            const { avatar } = updatedUser;

            if (avatar) {
                file.key = avatar.substr(avatar.indexOf("avatar/"));
                await uploadFile(file);
            } else {
                const { originalname } = file;

                file.key =
                    "avatar/" +
                    uuidv4() +
                    originalname.substr(originalname.lastIndexOf("."));

                const uploadedFile = await uploadFile(file);

                updatedUser.avatar = uploadedFile.Location;
            }

            await updatedUser.save();
        }

        res.status(200).json({ updatedUser });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { userId, password } = req.user;
    const { accessToken, expired } = req.jwt;
    const options = {};

    if (!expired) options.expiresIn = "7d";

    if (!currentPassword || !newPassword || !confirmPassword)
        return res.status(400).json({ message: "some fields are missing" });

    if (newPassword != confirmPassword)
        return res
            .status(400)
            .json({ message: "confirmPassword doesn't match newPassword" });

    try {
        const passwordValid = await argon2.verify(password, currentPassword);

        if (!passwordValid)
            return res.status(401).json({ message: "incorrect password" });

        const hashedPassword = await argon2.hash(newPassword);

        await User.findOneAndUpdate(
            { userId },
            { password: hashedPassword },
            { lean: true }
        );

        await InvalidToken.create({ token: accessToken });

        const newAccessToken = jwt.sign(
            { userId, expired: expired ? true : false },
            process.env.ACCESS_TOKEN_SECRET,
            options
        );

        res.status(200).json({
            message: "password changed successfully",
            newAccessToken,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
