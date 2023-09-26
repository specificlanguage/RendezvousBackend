import express from "express";
import { AuthMiddleware } from "./authorize";
import { Signup } from "./signup";
import { GetUser } from "./get";

export const usersRouter = express.Router();

usersRouter.use(AuthMiddleware);

// Gets a
usersRouter.get("/", GetUser);
usersRouter.get("/get", GetUser);
usersRouter.get("/get/:userID", GetUser);

// Signups the user
usersRouter.post("/signup", Signup);
