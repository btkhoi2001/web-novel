import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        index: {
            type: Number,
            require: true,
        },
        title: {
            type: String,
            maxLength: 100,
        },
        content: String,
        novelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "novels",
            required: true,
        },
    },
    { timestamps: true }
);

export const Chapter = mongoose.model("chapters", schema);
