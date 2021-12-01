import { User } from "../models/User.js";

export const getUserProfile = async (req, res) => {
    const { userId } = req.body;
    console.log(userId);

    try {
        const user = await User.findOne(
            { userId },
            {
                _id: 0,
                email: 1,
                displayName: 1,
                avatar: 1,
                description: 1,
            },
            {
                lean: true,
            }
        );

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
};
