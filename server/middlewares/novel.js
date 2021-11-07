import { User } from "../models/User.js";

export const verifyAuthor = async (req, res, next) => {
    try {
        const user = await User.findOne({ userId: req.body.userId });

        if (!user.isAuthor && !user.isAdmin)
            return res.status(401).json({
                message: "This user has no permission to upload novel",
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
