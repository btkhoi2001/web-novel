import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        commentId: {
            type: Number,
            unique: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        novelId: Number,
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
