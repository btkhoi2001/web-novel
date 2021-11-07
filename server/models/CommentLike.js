import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        commentId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const CommentLike = mongoose.model("commentLike", schema);
