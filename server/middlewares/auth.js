import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) return next();

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const { userId } = decoded;
        const user = await User.findOne(
            { userId },
            { _id: 0, userId: 1, role: 1 },
            { lean: true }
        );

        req.user = user;
        console.log(user);

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyUser = (req, res, next) => {
    const { user } = req;
    console.log(user);
    if (!user)
        return res.status(401).json({ message: "Access token not found" });

    next();
};

export const verifyAuthor = (req, res, next) => {
    const { user } = req;

    if (user.role != "Author")
        return res.status(401).json({
            message: "This user has no author permissions",
        });

    next();
};
