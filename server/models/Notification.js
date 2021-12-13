import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        receiverId: {
            type: Number,
            required: true,
        },
        title: String,
        message: String,
        isRead: {
            type: Boolean,
            default: false,
        },
        image: String,
        actionUrl: String,
    },
    { timestamps: true }
);

export const Notification = mongoose.model("notifications", schema);
