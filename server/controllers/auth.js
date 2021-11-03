import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
    const { email, displayName, password } = req.body;

    if (!email || !displayName || !password)
        return res.status(400).json({ message: "Some fields are missing" });

    try {
        const user = await User.findOne({ email });

        if (user)
            return res
                .status(400)
                .json({ message: "Email is already registered" });

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            email,
            displayName,
            password: hashedPassword,
        });

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
        res.status(500).json({ error });
    }
};

export const login = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ error });
    }
};
