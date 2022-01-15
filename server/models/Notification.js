import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);

const schema = new mongoose.Schema(
    {
        notificationId: {
            type: Number,
            unique: true,
        },
        receiverId: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            maxLength: 200,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        image: String,
        actionUrl: String,
    },
    { timestamps: true }
);

schema.plugin(AutoIncrement, { inc_field: "notificationId" });

export const Notification = mongoose.model("notifications", schema);
