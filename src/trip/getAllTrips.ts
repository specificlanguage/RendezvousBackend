import { Request, Response } from "express";
import { prisma } from "../db/prisma";

export async function GetAllTrips(req: Request, res: Response) {
    const userID = res.locals.userID;

    const trips = await prisma.trip.findMany({
        where: {
            accounts: {
                some: {
                    account: {
                        id: userID,
                    },
                },
            },
        },
    });

    res.json({ trips: trips });
}
