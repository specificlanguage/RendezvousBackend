import { Duffel } from "@duffel/api";

export const DUFFEL = new Duffel({
    token: process.env.DUFFEL_API_KEY ?? "",
});
