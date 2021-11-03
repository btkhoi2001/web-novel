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
    },
    { timestamps: true }
);

export const Novel = mongoose.model("novels", schema);
