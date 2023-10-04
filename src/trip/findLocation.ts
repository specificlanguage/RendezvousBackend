import { Request, Response } from "express";
import { GoogleMapsClient } from "../external/google";
import { PlaceAutocompleteType } from "@googlemaps/google-maps-services-js";

export function AutoCompleteLocation(req: Request, res: Response) {
    const { query, sessionToken } = req.body;

    GoogleMapsClient.placeAutocomplete({
        params: {
            input: query,
            types: PlaceAutocompleteType.cities,
            sessiontoken: sessionToken ?? "",
            key: process.env.GOOGLE_MAPS_PLACE_API_KEY ?? "",
        },
    })
        .then((resp) => {
            res.status(200).json(resp.data);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Request failed" });
        });
}
