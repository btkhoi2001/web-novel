import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        receiverId: {
            type: Number,
            required: true,
        },
        message: String,
        isRead: {
            type: Boolean,
            default: false,
        },
        actionUrl: String,
    },
    { timestamps: true }
);

export const Notification = mongoose.model("notifications", schema);
