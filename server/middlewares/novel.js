import { User } from "../models/User.js";

export const verifyAuthor = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });

        if (!user.isAuthor)
            return res.status(401).json({
                message: "This user has no permission to upload novel",
            });

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
