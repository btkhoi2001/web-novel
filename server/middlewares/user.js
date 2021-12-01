import { User } from "../models/User.js";

export const verifyUserId = async (req, res, next) => {
    const { userId } = req.params;

    try {
        if (!(await User.exists({ userId })))
            return res.status(404).json({
                message: `userId ${userId} not found`,
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
