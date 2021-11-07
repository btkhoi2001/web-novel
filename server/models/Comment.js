import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        CommentId: {
            type: Number,
            unique: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        chapterId: Number,
        parentCommentId: Number,
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "commentId" });

export const Comment = mongoose.model("comments", schema);
