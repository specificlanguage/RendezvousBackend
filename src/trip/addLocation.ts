import { Request, Response } from "express";
import { getAccount, isAdmin, prisma } from "../db/prisma";
import { GoogleMapsClient } from "../external/google";

export interface Location {
    description: string;
    place_id: string;
    lat?: number;
    long?: number;
}

interface AddLocationsBody {
    tripID: string;
    locations: Location[];
}

export async function AddLocations(req: Request, res: Response) {
    const userID = res.locals.userID;
    const account = await getAccount(userID);

    const { tripID, locations } = req.body as AddLocationsBody;

    if (account === null || !(await isAdmin(userID, tripID))) {
        res.status(401).json({ message: "Unauthenticated" });
        return;
    }

    // Get lat/long for all place IDS
    for (const loc of locations) {
        console.log(loc);
        const coords = await GoogleMapsClient.geocode({
            params: {
                key: process.env.GOOGLE_MAPS_GEOCODING_API_KEY ?? "",
                place_id: loc.place_id,
            },
        })
            .then((resp) => {
                const results = resp.data.results;
                const { lat, lng } = results[0].geometry.location;
                loc.lat = lat;
                loc.long = lng;
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            });

        if (!coords) {
            res.status(500).json({ message: "Error occurred!" });
            return;
        }
    }

    await prisma.trip.update({
        where: {
            id: tripID,
        },
        data: {
            locations: {
                create: locations.map((loc) => {
                    return {
                        lat: loc.lat ?? 0,
                        long: loc.long ?? 0,
                        placeID: loc.place_id,
                        name: loc.description,
                    };
                }),
            },
        },
    });

    res.status(201).json({ message: "All locations assigned" });
}
