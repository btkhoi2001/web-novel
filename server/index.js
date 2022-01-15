import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { verifyToken } from "./middlewares/auth.js";
import authRouter from "./routes/auth.js";
import novelRouter from "./routes/novel.js";
import userRouter from "./routes/user.js";
import commentRouter from "./routes/comment.js";
import bookmarkRouter from "./routes/bookmark.js";
import followRouter from "./routes/follow.js";
import notificationRouter from "./routes/notification.js";
import adminRouter from "./routes/admin.js";
import scheduler from "./schedules/jobs.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@webnovel.aquyp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json({ limit: "50mb" }));
app.use(verifyToken);
app.use("/api/auth", authRouter);
app.use("/api/novel", novelRouter);
app.use("/api/user", userRouter);
app.use("/api/follow", followRouter);
app.use("/api/bookmark", bookmarkRouter);
app.use("/api/comment", commentRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/admin", adminRouter);

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            scheduler();
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
