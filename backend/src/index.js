import 'dotenv/config';
import express from "express";
import userRouter from "./routers/userAuth.routes.js";
import messageRoutes from "./routers/message.routes.js"
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';

import cors from "cors";
import { app, server } from './lib/socket.js';

import path from "path";

// const app = express();

const PORT = process.env.PORT ?? 8000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"]
}))

app.use("/auth/user", userRouter);
app.use("/auth/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
    console.log(`Server is UP and listening on PORT: ${PORT}`);
    connectDB();
});

