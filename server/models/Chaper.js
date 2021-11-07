import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        chapterId: {
            type: Number,
            unique: true,
        },
        title: {
            type: String,
            maxLength: 100,
        },
        content: String,
        novelId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "chaperId" });

export const Chapter = mongoose.model("chapters", schema);
