import { Request, Response } from "express";
import { getAccount, isInTrip, prisma } from "../db/prisma";
import axios from "axios";

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

    // Check if invite has already been sent for trip
    const alreadyInvited = await prisma.tripInvite
        .findMany({
            where: {
                tripID,
                email: {
                    in: emails,
                },
            },
            select: {
                email: true,
            },
        })
        .then((res) => res.map((r) => r.email));

    const emailsToSend = emails.filter(
        (email) => alreadyInvited.includes(email) === false,
    );

    // Create invite if invite does not exist
    // Note that this query creates the invites and returns trip data.
    const tripData = await prisma.trip.update({
        where: {
            id: tripID,
        },
        data: {
            invites: {
                create: emailsToSend.map((email) => ({ email })),
            },
        },
        select: {
            tripName: true,
        },
    });

    const invites = await prisma.tripInvite.findMany({
        where: {
            tripID,
            email: {
                in: emails,
            },
        },
        select: {
            email: true,
            id: true,
        },
    });

    invites.map((i: { email: string; id: string }) => {
        axios({
            url: `${process.env.EMAIL_SERVICE_URL}/invite`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                toEmail: i.email,
                tripName: tripData.tripName,
                inviteID: i.id,
                inviter: account.name,
            }),
        }).catch((e) => console.log(e)); // No shutdowns
    });

    res.status(200).json({ message: "Invites sent" });
}

export async function GetInvite(req: Request, res: Response) {
    const tripInvite = await prisma.tripInvite.findFirst({
        where: {
            id: req.params.inviteID,
        },
    });

    if (tripInvite === undefined || tripInvite === null) {
        res.status(404).json();
    } else {
        res.status(200).json({
            inviteID: tripInvite.id,
            tripID: tripInvite.tripID,
        });
    }
}

export async function AcceptInvite(req: Request, res: Response) {
    const userID = res.locals.userID;
    const account = await getAccount(userID);

    if (!account) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const accountID: string = account.id;
    const tripInvite = await prisma.tripInvite.findFirst({
        where: {
            id: req.params.inviteID,
        },
    });

    if (tripInvite === undefined || tripInvite === null) {
        res.status(404);
        return;
    }

    let trip = undefined;

    // Check if user is already in trip
    if (await isInTrip(accountID, tripInvite.tripID)) {
        res.status(202).json({
            tripID: tripInvite.tripID,
            message: "Error when adding to trip, try again",
        });
        return;
    }

    try {
        // Connect user to trip
        trip = await prisma.trip.update({
            where: {
                id: tripInvite.tripID,
            },
            data: {
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
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error when adding to trip, try again",
        });
        return;
    }

    try {
        // Delete invite in case of duplications
        await prisma.tripInvite.delete({
            where: {
                id: req.params.inviteID,
            },
        });
        res.status(200).json({
            tripID: trip.id,
        });
    } catch (e) {
        console.log(e);
        res.status(202).json({
            tripID: trip.id,
            error: "Could not remove invite -- please contact admin and do not use invite again.",
        });
    }
}
