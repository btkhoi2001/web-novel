import { Notification } from "../models/Notification.js";

export const getNotification = async (req, res) => {
    const { isRead } = req.query;
    const { userId } = req.user;
    const queryMatch = { receiverId: userId };
    let { page, limit } = req.query;

    page = page || 1;
    limit = limit || Number.MAX_SAFE_INTEGER;

    if (isRead) queryMatch.isRead = isRead;

    try {
        const notifications = (
            await Notification.aggregate([
                {
                    $match: queryMatch,
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $facet: {
                        data: [
                            {
                                $project: {
                                    _id: 0,
                                    notificationId: 1,
                                    title: 1,
                                    message: 1,
                                    isRead: 1,
                                    image: 1,
                                    actionUrl: 1,
                                },
                            },
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: parseInt(limit),
                            },
                        ],
                        totalPages: [{ $count: "totalPages" }],
                    },
                },
            ])
        )[0];

        res.status(200).json({
            notifications: notifications.data,
            totalPages:
                notifications.totalPages.length == 0
                    ? 0
                    : Math.ceil(notifications.totalPages[0].totalPages / limit),
        });
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
