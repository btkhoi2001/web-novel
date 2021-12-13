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
    },
    { timestamps: true }
);

export const Follow = mongoose.model("follows", schema);
