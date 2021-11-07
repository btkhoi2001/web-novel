import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        reviewId: {
            type: Number,
            unique: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        novelId: {
            type: Number,
            required: true,
        },
        parentReviewId: Number,
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

schema.plugin(AutoIncrement, { inc_field: "reviewId" });

export const Review = mongoose.model("reviews", schema);
