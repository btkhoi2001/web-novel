import { Notification } from "../models/Notification.js";

export const getNotification = async (req, res) => {
    const { userId } = req.body;
    const { isRead } = req.query;
    const query = { receiverId: userId };

    if (isRead) query.isRead = isRead;

    try {
        const notifications = await Notification.find(
            query,
            { _id: 0 },
            { lean: true }
        );

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateNotification = async (req, res) => {
    const { notificationId } = req.params;
    const { isRead } = req.body;

    try {
        const updatedNotification = await Notification.findOneAndUpdate(
            { notificationId },
            { isRead },
            { lean: true, new: true }
        );

        res.status(200).json({ updatedNotification });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const deletedNotification = await Notification.findOneAndDelete(
            { notificationId },
            { lean: true }
        );

        res.status(200).json({ deletedNotification });
    } catch (error) {
        res.status(500).json({ error });
    }
};
