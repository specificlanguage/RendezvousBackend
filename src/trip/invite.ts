import { Request, Response } from "express";
import { getAccount, isInTrip, prisma } from "../db/prisma";

export interface InviteUsersBody {
    tripID: string;
    emails: string[];
}

export async function InviteUsers(req: Request, res: Response) {
    const userID = res.locals.userID;
    const account = await getAccount(userID);

    if (!account) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const accountID: string = account?.id;
    const { tripID, emails } = req.body as InviteUsersBody;

    // Check that accountID is in the trip requested
    if (!(await isInTrip(accountID, tripID))) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Create trip
    await prisma.trip.update({
        where: {
            id: tripID,
        },
        data: {
            invites: {
                connectOrCreate: emails.map((email) => {
                    return {
                        where: {
                            email_tripID: {
                                email,
                                tripID,
                            },
                        },
                        create: {
                            email,
                            tripID,
                        },
                    };
                }),
            },
        },
    });

    // TODO: Send emails to invite these users
    // TODO: When a user creates an account, automatically associate them with the trip
    res.status(200).json({ message: "Invite sent*" });
}
