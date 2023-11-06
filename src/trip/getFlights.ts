import { Request, Response } from "express";
import { getFlights, isInTrip, tripExists } from "../db/prisma";

export async function GetAllFlights(req: Request, res: Response) {
    const userID = res.locals.userID;
    const tripID = (req.query.tripID ?? "") as string;
    const onlySelf = req.query.onlySelf === "true";

    if (tripID === "" || !(await tripExists(tripID))) {
        res.status(500).json({ message: "Trip does not exist" });
        return;
    } else if (!(await isInTrip(userID, tripID))) {
        res.status(401);
    }

    const flights = await getFlights(tripID, onlySelf ? userID : undefined);
    res.status(200).json(flights);
}
