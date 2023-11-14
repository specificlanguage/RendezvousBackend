import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { GetFlight } from "./getFlight";
import { ImportFlight } from "./import";
import { GetAirport } from "./airportInfo";

export const flightRouter = express.Router();

// flightRouter.use(AuthMiddleware);

flightRouter.get("/search", GetFlight);
flightRouter.post("/import", ImportFlight);
flightRouter.get("/airport", GetAirport);
