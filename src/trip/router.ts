import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { GetAllTrips } from "./getAllTrips";
import { AutoCompleteLocation } from "./findLocation";
import { CreateTrip } from "./createTrip";

export const tripRouter = express.Router();

tripRouter.use(AuthMiddleware);

// Gets all trips that belong to the user from the database
tripRouter.get("/", GetAllTrips);
tripRouter.post("/findLocation", AutoCompleteLocation);
tripRouter.post("/create", CreateTrip);
