import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        novelId: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        daily: {
            type: Number,
            default: 0,
        },
        weekly: {
            type: Number,
            default: 0,
        },
        monthly: {
            type: Number,
            default: 0,
        },
        all: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const NovelCounter = mongoose.model("novelCounters", schema);
