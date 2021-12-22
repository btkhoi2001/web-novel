import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { InvalidToken } from "../models/InvalidToken.js";

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) return next();

    try {
        if (await InvalidToken.exists({ token: accessToken })) return next();

        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const { userId, expired } = decoded;

        const user = await User.findOne(
            { userId },
            { _id: 0, userId: 1, role: 1, password: 1 },
            { lean: true }
        );

        if (user.isBlocked) return next();

        req.user = user;
        req.jwt = { accessToken, expired };

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyUser = (req, res, next) => {
    const { user } = req;

    if (!user)
        return res.status(401).json({ message: "access token not found" });

    next();
};

export const verifyAuthor = (req, res, next) => {
    const { user } = req;

    if (user.role != "Author")
        return res.status(401).json({
            message: "this user has no author permissions",
        });

    next();
};

export const verifyAdmin = (req, res, next) => {
    const { user } = req;

    if (user.role != "Admin")
        return res.status(401).json({
            message: "this user has no admin permissions",
        });

    next();
};
