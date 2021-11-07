import mongoose from "mongoose";
import validator from "validator";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        userId: {
            type: Number,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, "Invalid email"],
        },
        displayName: {
            type: String,
            required: true,
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
        isAdmin: {
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

schema.plugin(AutoIncrement, { inc_field: "userId" });

export const User = mongoose.model("users", schema);
