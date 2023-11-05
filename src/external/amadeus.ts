// eslint-disable-next-line @typescript-eslint/no-var-requires
const Amadeus = require("amadeus"); // No way to do it otherwise :(

export const AMADEUS = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
});
