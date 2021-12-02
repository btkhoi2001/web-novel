import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        novelId: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 10,
            required: true,
        },
    },
    { timestamps: true }
);

export const Rating = mongoose.model("ratings", schema);
