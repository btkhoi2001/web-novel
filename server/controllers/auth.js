import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const loggedIn = async (req, res) => {
    try {
        if (!(await User.exists({ _id: req.body.userId })))
            return res.status(401).json({ message: "User not found" });

        res.status(200).json({ message: "User is already logged in" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const register = async (req, res) => {
    const { email, displayName, password } = req.body;

    if (!email || !displayName || !password)
        return res.status(400).json({ message: "Some fields are missing" });

    try {
        if (await User.exists({ email }))
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
            { userId: newUser.userId },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.status(201).json({
            message: "User created successfully",
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Missing email or password" });

    try {
        const test = await User.exists({ email });

        if (!(await User.exists({ email })))
            return res
                .status(401)
                .json({ message: "Incorrect email or password" });

        const user = await User.findOne({ email });
        const passwordValid = await argon2.verify(user.password, password);

        if (!passwordValid)
            return res
                .status(401)
                .json({ message: "Incorrect email or password" });

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.status(200).json({
            message: "User logged in successfully",
            accessToken,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
