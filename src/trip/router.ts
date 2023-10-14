import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { GetAllTrips } from "./getAllTrips";
import { AutoCompleteLocation } from "./findLocation";
import { CreateTrip } from "./createTrip";
import { AddLocations } from "./addLocation";
import { InviteUsers } from "./invite";
import { GetUsersOnTrip } from "./getUsersOnTrip";

export const tripRouter = express.Router();

tripRouter.use(AuthMiddleware);

// Gets all trips that belong to the user from the database
tripRouter.get("/", GetAllTrips);
tripRouter.post("/findLocation", AutoCompleteLocation);

// Creation workflow: Create the trip, add locations, invite user
tripRouter.post("/create", CreateTrip);
tripRouter.post("/locations", AddLocations);
tripRouter.post("/invite", InviteUsers);

tripRouter.get("/users", GetUsersOnTrip);
