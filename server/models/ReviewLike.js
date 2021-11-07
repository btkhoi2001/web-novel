import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        reviewId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const ReviewLike = mongoose.model("reviewLikes", schema);
