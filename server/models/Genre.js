import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        name: String,
    },
    { timestamps: true }
);

export const Genre = mongoose.model("genres", schema);
