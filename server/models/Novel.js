import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            maxLength: 200,
        },
        views: {
            type: Number,
            default: 0,
        },
        nominations: {
            type: Number,
            default: 0,
        },
        cover: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    { timestamps: true }
);

export const Novel = mongoose.model("novels", schema);
