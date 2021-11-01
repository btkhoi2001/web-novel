import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@webnovel.aquyp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json({ limit: "50mb" }));
app.use("/api/auth", authRouter);

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
