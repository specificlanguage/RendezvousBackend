import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

interface SignupBody {
    name: string;
}

export async function Signup(req: Request, res: Response) {
    const userId = res.locals.userID;
    console.log(req.body);
    const { name } = req.body as SignupBody;
    const prisma = new PrismaClient();

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
