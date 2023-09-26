import express from "express";
import cors from "cors";
import { usersRouter } from "./users/router";

const app = express();
const port = 3000;

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        allowedHeaders: ["Content-Type, Authorization"],
    }),
);
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hello world!",
    });
});

app.use("/user", usersRouter);

app.listen(port, () => {
    console.log(`Rendezvous backend is running on port ${port}`);
});
