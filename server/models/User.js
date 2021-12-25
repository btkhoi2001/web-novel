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
            index: true,
        },
        displayName: {
            type: String,
            required: true,
            index: true,
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
        gender: {
            type: String,
            enum: ["Bí mật", "Nam", "Nữ"],
            default: "Bí mật",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["Reader", "Author", "Admin"],
            default: "Reader",
        },
        flowers: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

schema.index({ email: "text", displayName: "text" });
schema.plugin(AutoIncrement, { inc_field: "userId" });

export const User = mongoose.model("users", schema);
