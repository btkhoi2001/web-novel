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
        chapterId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const ChapterRead = mongoose.model("chapterReads", schema);
