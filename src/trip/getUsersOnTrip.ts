import { Request, Response } from "express";
import { getAccount, isInTrip, prisma, tripExists } from "../db/prisma";

export async function GetUsersOnTrip(req: Request, res: Response) {
    const userID = res.locals.userID;
    const account = await getAccount(userID);
    const tripID = (req.query.tripID ?? "") as string;

    if (tripID === "" || !(await tripExists(tripID))) {
        res.status(500).json({ message: "Trip does not exist" });
        return;
    }

    if (!(await isInTrip(account?.id ?? "", tripID ?? ""))) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

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

    res.status(200).json({
        count: users.length ?? 0,
        users,
    });
}
