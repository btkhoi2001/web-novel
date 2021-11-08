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

        res.status(200).json({ novel });
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
            message: "Novel created successfully",
            newNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateNovel = async (req, res) => {
    const { title, description, cover, genres } = req.body;

    try {
        const updatedNovel = await Novel.findOneAndUpdate(
            { novelId: req.params.novelId },
            {
                title,
                description,
                cover,
                genres,
            },
            { new: true }
        );

        res.status(200).json({
            message: "Novel updated successfully",
            updatedNovel,
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteNovel = async (req, res) => {
    const { novelId } = req.params;

    try {
        const deletedNovel = await Novel.findOneAndDelete({ novelId });
        res.status(200).json({ deletedNovel });
    } catch (error) {
        res.status(500).json({ error });
    }
};