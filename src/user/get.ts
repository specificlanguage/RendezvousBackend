import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface GetUsersBody {
    userIDs: string[];
}

export async function GetUser(req: Request, res: Response) {
    let userID: string = res.locals.userID;
    if (req.params.userID) {
        userID = req.params.userID;
    }

    const account = await prisma.account.findFirst({
        where: {
            id: {
                equals: userID,
            },
        },
    });

    if (account) {
        res.status(200).json(account);
    } else {
        res.status(500).json({ message: "Account not found" });
    }
}

// NOTE: this uses body, so this must be post
export async function GetUsers(req: Request, res: Response) {
    const { userIDs } = req.body as GetUsersBody;

    const accounts = await prisma.account.findMany({
        where: {
            id: {
                in: userIDs,
            },
        },
    });

    if (accounts.length === 0) {
        res.status(500).json({ message: "Accounts not found" });
    } else if (accounts.length < userIDs.length) {
        res.status(202).json(userIDs);
    } else {
        res.status(200).json(userIDs);
    }
}
