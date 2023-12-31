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
    const res = await prisma.trip
        .findFirst({
            where: {
                id: tripid,
                adminID: uid,
            },
        })
        .catch((err) => {
            console.log(err);
            return null;
        });

    return res != null;
}

export async function isInTrip(uid: string, tripid: string): Promise<boolean> {
    const isInTrip = await prisma.tripAccounts
        .findFirst({
            where: {
                tripID: tripid,
                accountID: uid,
            },
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
    return isInTrip != null;
}

export async function tripExists(tripID: string): Promise<boolean> {
    return (
        (await prisma.trip.findFirst({
            where: {
                id: tripID,
            },
        })) != null
    );
}

export async function getFlights(tripID: string, userID?: string) {
    return await prisma.flight.findMany({
        where: {
            tripID,
            ...(userID ? { passengers: { some: { id: userID } } } : {}),
        },
    });
}

export async function getTrip(tripID: string) {
    return await prisma.trip.findFirst({
        where: {
            id: tripID,
        },
    });
}
