import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { CreateTrip } from "./createTrip";
import { AddLocations } from "./addLocation";
import { InviteUsers } from "./invite";
import { GetUsersOnTrip } from "./getUsersOnTrip";
import { GetSingleTrip } from "./getTrip";

export const tripRouter = express.Router();

tripRouter.use(AuthMiddleware);

// Creation workflow: Create the trip, add locations, invite user
tripRouter.post("/create", CreateTrip);
tripRouter.post("/locations", AddLocations);
tripRouter.post("/invite", InviteUsers);

// Utility endpoints to get users, single trip, etc.
tripRouter.get("/", GetSingleTrip);
tripRouter.get("/users", GetUsersOnTrip);
