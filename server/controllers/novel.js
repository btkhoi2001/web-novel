import { User } from "../models/User.js";
import { Novel } from "../models/Novel.js";

export const getNovel = async (req, res) => {
    try {
        const novels = await Novel.find({});
        res.status(200).json({ novels });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getNovelById = async (req, res) => {
    const { novelId } = req.params;
    try {
        const novel = await Novel.findOne({ novelId });

        if (!novel)
            res.status(404).json({
                message: `novelId ${novelId} doesn't exist`,
            });
        else res.status(200).json({ novel });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createNovel = async (req, res) => {
    const { userId, title, description, cover, genres } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    try {
        const newNovel = new Novel({
            title,
            description,
            cover,
            authorId: userId,
            genres,
        });

        await newNovel.save();

        res.status(201).json({
            newNovel,
            message: "Novel created successfully",
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
