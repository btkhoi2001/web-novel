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
            index: true,
        },
        content: {
            type: String,
            required: true,
        },
        novelId: {
            type: Number,
            required: true,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

schema.index({ title: "text" });
schema.plugin(AutoIncrement, { inc_field: "chapterId" });

export const Chapter = mongoose.model("chapters", schema);
