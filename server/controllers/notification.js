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
