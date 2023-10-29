import express from "express";
import { AuthMiddleware } from "./authorize";
import { Signup } from "./signup";
import { GetUser, GetUsers } from "./get";
import { GetAllTrips } from "./getAllTrips";

export const usersRouter = express.Router();

usersRouter.use(AuthMiddleware);

// Gets a user ID, as a parameter if specified, otherwise from the auth header if not specified.
usersRouter.get("/", GetUser);
usersRouter.get("/get", GetUser);
usersRouter.get("/get/:userID", GetUser);
usersRouter.post("/getUsers", GetUsers);

// Signups the user into the database (actual security does not happen here, it happens in firebase.)
usersRouter.post("/signup", Signup);

// Get all trips associated with the user
usersRouter.get("/trips", GetAllTrips);
