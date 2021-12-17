import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        bookmarkId: {
            type: Number,
            unique: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        novelId: {
            type: Number,
            required: true,
        },
        chapterId: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "bookmarkId" });

export const Bookmark = mongoose.model("bookmarks", schema);
