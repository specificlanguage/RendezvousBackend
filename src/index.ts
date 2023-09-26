import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { usersRouter } from "./users/router";

const app = express();
const port = 3000;

app.use(
    cors({
        credentials: true,
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: [
            "Authorization",
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers",
            "Cache-Control",
        ],
    }),
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hello world!",
    });
});

app.use("/user", usersRouter);

app.listen(port, () => {
    console.log(`Rendezvous backend is running on port ${port}`);
});
