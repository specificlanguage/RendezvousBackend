import { Request, Response } from "express";
import { prisma } from "../db/prisma";

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
