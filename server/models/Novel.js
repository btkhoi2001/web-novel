import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            maxLength: 500,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        genres: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "genres",
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "novelNo" });

export const Novel = mongoose.model("novels", schema);
