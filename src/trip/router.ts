import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { GetAllTrips } from "./getAllTrips";

export const tripRouter = express.Router();

tripRouter.use(AuthMiddleware);

// Gets all trips that belong to the user from the database
tripRouter.get("/", GetAllTrips);
