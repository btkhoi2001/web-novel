import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        usernameId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "chapters",
            required: true,
        },
        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Comment = mongoose.model("comments", schema);
