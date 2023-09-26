import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface SignupBody {
    name: string;
}

export async function Signup(req: Request, res: Response) {
    const userId = res.locals.userID;
    const { name } = req.body as SignupBody;

    try {
        const account = await prisma.account.findFirstOrThrow({
            where: { id: userId },
        });

        if (account) {
            res.status(500).json({
                message: "User exists",
            });
        }
    } catch (e) {
        if (!name) {
            res.status(400).json({
                message: "Name needed in body",
            });
            return;
        }

        await prisma.account.create({
            data: {
                id: userId,
                name: name,
            },
        });
        res.status(201).json({ name: name });
    }
}
