import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        novelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "novels",
            required: true,
        },
        parentReviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reviews",
        },
        content: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { timestamps: true }
);

export const Review = mongoose.model("reviews", schema);
