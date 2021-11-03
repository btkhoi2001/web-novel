import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
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
