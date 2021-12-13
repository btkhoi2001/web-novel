import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        chapterId: {
            type: Number,
            unique: true,
        },
        chapterOrder: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        novelId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "chapterId" });

export const Chapter = mongoose.model("chapters", schema);
