import { getFlightInfo } from "../../src/flights/getFlight";
import { describe, test, expect } from "@jest/globals";

describe("Flights creation", () => {
    test("Can fetch past flight status", async () => {
        const date = new Date();
        const flight = await getFlightInfo(date, "AA", 1);
        expect(flight.data).toBeDefined();

        // Check data for basic information
        expect(flight.data).toEqual(
            expect.objectContaining({
                flightDesignator: {
                    carrierCode: "AA",
                    flightNumber: 1,
                    segments: expect.arrayContaining([
                        expect.objectContaining({
                            boardPointIataCode: "JFK",
                            offPointIataCode: "LAX",
                        }),
                    ]),
                },
            }),
        );
    });
});
