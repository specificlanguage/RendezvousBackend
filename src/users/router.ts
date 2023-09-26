import express from "express";
import { AuthMiddleware } from "./authorize";
import { Signup } from "./signup";

export const usersRouter = express.Router();

usersRouter.use(AuthMiddleware);

usersRouter.post("/signup", Signup);
