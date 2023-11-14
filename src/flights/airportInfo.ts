import axios from "axios";
import { Request, Response } from "express";

async function getAirportInfo(airCode: string) {
    if (airCode.length === 4) {
        return axios.get(
            `https://api.api-ninjas.com/v1/airports?icao=${airCode}`,
            { headers: { "x-api-key": process.env.AIRPORT_API_KEY } },
        );
    } else {
        return axios.get(
            `https://api.api-ninjas.com/v1/airports?iata=${airCode}`,
            { headers: { "x-api-key": process.env.AIRPORT_API_KEY } },
        );
    }
}

export async function GetAirport(req: Request, res: Response) {
    const { code } = req.query;
    const query = await getAirportInfo(code as string);
    res.status(200).json({ results: query.data });
}
