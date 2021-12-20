import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        novelId: {
            type: Number,
            unique: true,
        },
        title: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: "",
        },
        cover: String,
        authorId: {
            type: Number,
            required: true,
        },
        genre: String,
        genreId: Number,
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

schema.index({ title: "text" });
schema.plugin(AutoIncrement, { inc_field: "novelId" });

export const Novel = mongoose.model("novels", schema);
