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
        },
        description: {
            type: String,
            default: "",
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
        authorId: {
            type: Number,
            required: true,
        },
        genres: {
            type: [String],
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "novelId" });

export const Novel = mongoose.model("novels", schema);
