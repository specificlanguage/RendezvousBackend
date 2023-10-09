import { PrismaClient, Account } from "@prisma/client";

export const prisma = new PrismaClient();

export async function getAccount(id: string): Promise<Account | null> {
    return await prisma.account.findFirst({
        where: {
            id: id,
        },
    });
}
