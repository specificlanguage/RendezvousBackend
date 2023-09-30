import Amadeus from "amadeus";

export const AMADEUS = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
});
