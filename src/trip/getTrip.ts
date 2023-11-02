import { Request, Response } from "express";
import { isInTrip, prisma, tripExists } from "../db/prisma";

export async function GetSingleTrip(req: Request, res: Response) {
    const userID = res.locals.userID;
    const tripID = (req.query.tripID ?? "") as string;

    if (tripID === "" || !(await tripExists(tripID))) {
        res.status(500).json({ message: "Trip does not exist" });
        return;
    }

    const trip = await prisma.trip.findFirst({
        where: {
            id: tripID,
        },
    });

    if (!trip) {
        res.status(404).json({ message: "Trip not found" });
        return;
    }

    const locations = await prisma.location.findMany({
        where: {
            trips: {
                some: {
                    id: tripID,
                },
            },
        },
    });

    const users = await prisma.account.findMany({
        where: {
            trips: {
                some: {
                    trip: {
                        id: tripID,
                    },
                },
            },
        },
    });

    const inTrip = await isInTrip(userID, tripID);

    if (!inTrip) {
        res.status(200).json({
            ...trip,
            users: users.filter((user) => trip?.adminID == user.id),
            numUsers: users.length,
            locations: locations.map((loc) => loc.name),
        });
    } else {
        res.status(200).json({
            ...trip,
            users,
            locations: locations.map((loc) => loc.name),
        });
    }
}
