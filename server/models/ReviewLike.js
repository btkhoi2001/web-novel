import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reviews",
            required: true,
        },
    },
    { timestamps: true }
);

export const Novel = mongoose.model("novels", schema);
