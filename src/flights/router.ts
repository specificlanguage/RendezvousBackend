import express from "express";
import { AuthMiddleware } from "../user/authorize";
import { GetFlight } from "./getFlight";

export const flightRouter = express.Router();

// flightRouter.use(AuthMiddleware);

flightRouter.get("/", GetFlight);
