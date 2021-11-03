import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken)
        return res.status(401).json({ message: "Access token not found" });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded;

        next();
    } catch (error) {
        res.status(500).json({ error });
    }
};
