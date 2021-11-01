import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({ message: "Some fields are missing" });

    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user)
            return res
                .status(400)
                .json({ message: "User is already registered" });
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
            message: "User created successfully",
            accessToken,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

export const login = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json(error);
    }
};
