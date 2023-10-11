import { PrismaClient, Account } from "@prisma/client";

export const prisma = new PrismaClient();

export async function getAccount(id: string): Promise<Account | null> {
    return await prisma.account.findFirst({
        where: {
            id: id,
        },
    });
}

export async function isAdmin(uid: string, tripid: string): Promise<boolean> {
    const res = await prisma.trip.findFirst({
        where: {
            id: tripid,
            adminID: uid,
        },
    });

    return !!res;
}
