import { Request, Response } from "express";
import { getFlightInfo } from "./getFlight";
import { isInTrip, prisma } from "../db/prisma";

interface ImportFlightBody {
    tripID: string;
    flightNumber: number;
    originCode: string; // needed to disambiguate multiple flights
    carrierCode: string;
    scheduledDate: string | Date;
    isPublic: boolean;
}

export async function ImportFlight(req: Request, res: Response) {
    const userID = res.locals.userID;
    const {
        flightNumber,
        carrierCode,
        originCode,
        scheduledDate,
        tripID,
        isPublic,
    } = req.body as ImportFlightBody;

    const flightResults = await getFlightInfo(
        new Date(scheduledDate),
        carrierCode,
        flightNumber,
    );

    if (
        flightResults.result.data == undefined ||
        flightResults.result.data.length < 1
    ) {
        res.status(404).json({ message: "Flight does not exist" });
        return;
    }

    const fixedFlight = flightResults.data.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (data: unknown) => data.flightPoints[0].iataCode === originCode,
    );

    if (!(await isInTrip(userID, tripID))) {
        res.status(401).json({ message: "Unauthorized" });
    }

    const flight = prisma.flight.create({
        data: {
            carrierCode,
            tripID: tripID,
            flightNum: flightNumber,
            origin: originCode,
            destination: fixedFlight.flightPoints[1].iataCode,
            departureTime: new Date(
                fixedFlight.flightPoints[0].departure.timings[0].value,
            ),
            arrivalTime: new Date(
                fixedFlight.flightPoints[1].arrival.timings[0].value,
            ),
            public: isPublic,
        },
    });

    res.status(200).json(flight);
}
