import { Request, Response } from "express";
import { format } from "date-fns";
import { AMADEUS } from "../external/amadeus";

interface FlightQuery {
    [key: string]: string;
}

export async function getFlightInfo(
    date: Date,
    icaoCode: string,
    flightNum: number,
) {
    return await AMADEUS.client.get("/v2/schedule/flights", {
        carrierCode: icaoCode,
        flightNumber: flightNum,
        scheduledDepartureDate: format(date, "yyy-MM-dd"),
    });
}

export async function GetFlight(req: Request, res: Response) {
    const { flightNumber, carrierCode, scheduledDate } =
        req.query as FlightQuery;

    const depDate = new Date(scheduledDate);
    if (depDate <= new Date()) {
        // today
        res.status(400).json({ message: "Use date after today" });
        return;
    }

    const flight = await getFlightInfo(
        new Date(scheduledDate),
        carrierCode,
        parseInt(flightNumber),
    ).catch((e) => console.log(e));

    if (flight.result.data == undefined || flight.result.data.length < 1) {
        res.status(204);
        return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const flightSegments = flight.data.map((data) => ({
        carrierCode: data.flightDesignator.carrierCode,
        flightNum: data.flightDesignator.flightNumber,
        date: data.scheduledDepartureDate,
        origin: data.flightPoints[0].iataCode,
        destination: data.flightPoints[1].iataCode,
        departure: data.flightPoints[0].departure.timings[0].value,
        arrival: data.flightPoints[1].arrival.timings[0].value,
    }));

    res.status(200).json({ segments: flightSegments });
}
