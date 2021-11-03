import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: String,
        description: {
            type: String,
            maxLength: 200,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isAuthor: {
            type: Boolean,
            default: false,
        },
        flowers: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "userNo" });

export const User = mongoose.model("users", schema);
