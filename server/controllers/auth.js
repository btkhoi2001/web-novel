import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
    const { email, displayName, password, confirmPassword } = req.body;

    if (!email || !displayName || !password || !confirmPassword)
        return res.status(400).json({ message: "some fields are missing" });

    if (password != confirmPassword)
        return res
            .status(400)
            .json({ message: "password confirmation doesn't match password" });

    try {
        if (await User.exists({ email }))
            return res
                .status(400)
                .json({ message: "email is already registered" });

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
            message: "user created successfully",
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
            { userId: user.userId },
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
