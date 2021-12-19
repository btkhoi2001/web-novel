import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        token: String,
    },
    { timestamps: true }
);

export const InvalidToken = mongoose.model("invalidTokens", schema);
