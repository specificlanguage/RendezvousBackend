import { Request, Response } from "express";
import { getAccount, prisma } from "../db/prisma";

interface CreateTripBody {
    tripName: string;
    startDate: string; // transform into enddate
    endDate: string;
}

export async function CreateTrip(req: Request, res: Response) {
    const userID = res.locals.userID;
    const account = await getAccount(userID);

    const { tripName, startDate, endDate } = req.body as CreateTripBody;

    if (account === null) {
        res.status(403).json({ message: "Not logged in" });
        return;
    }

    const accountID = account.id;

    // Create trip
    const trip = await prisma.trip.create({
        data: {
            tripName,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            admin: {
                connect: {
                    id: accountID,
                },
            },
            accounts: {
                create: [
                    {
                        account: {
                            connect: {
                                id: accountID,
                            },
                        },
                    },
                ],
            },
        },
    });

    res.status(201).json({
        id: trip.id,
        name: tripName,
    });
}
