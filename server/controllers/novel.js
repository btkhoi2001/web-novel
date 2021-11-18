import { v4 as uuidv4 } from "uuid";
import { Novel } from "../models/Novel.js";
import { uploadFile, deleteFile } from "../aws/s3.js";

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
    const { userId, title, description, genres } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    try {
        const file = req.file;
        const { originalname } = file;
        file.key =
            "cover/" +
            uuidv4() +
            originalname.substr(originalname.lastIndexOf("."));
        const uploadedFile = await uploadFile(file);

        const newNovel = new Novel({
            title,
            description,
            cover: uploadedFile.Location,
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
    const { title, description, genres, isComplete } = req.body;

    try {
        const novel = await Novel.findOne({ novelId: req.params.novelId });

        const updatedNovel = await Novel.findOneAndUpdate(
            { novelId: req.params.novelId },
            {
                title,
                description,
                genres,
                isComplete,
            },
            { new: true }
        );

        const file = req.file;
        const { cover } = novel;
        file.key = cover.substr(cover.indexOf("cover/"));
        await uploadFile(file);

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
        const { cover } = deletedNovel;
        const key = cover.substr(cover.indexOf("cover/"));
        await deleteFile(key);

        res.status(200).json({ deletedNovel });
    } catch (error) {
        res.status(500).json({ error });
    }
};
