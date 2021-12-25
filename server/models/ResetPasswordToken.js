import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

export const ResetPasswordToken = mongoose.model("resetPasswordTokens", schema);
