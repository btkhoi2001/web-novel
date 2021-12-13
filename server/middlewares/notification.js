import { Notification } from "../models/Notification.js";

export const verifyNotificationId = async (req, res, next) => {
    const { notificationId } = req.params;
    const { userId } = req.body;

    try {
        if (
            !(await Notification.exists({ receiverId: userId, notificationId }))
        )
            return res.status(404).json({
                message: `notificationId ${notificationId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
