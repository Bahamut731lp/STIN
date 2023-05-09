import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import rates from "../database/exchange.ts";
import app from "../server.ts"

Deno.test("Currencies #1: Result is a array of strings", async () => {
    const count = await rates.count();
    if (count == 0) {
        await rates.insertMany([
            {
                "kurz": 1,
                "mnozstvi": 1,
                "timestamp": "2023-05-07T22:00:00.000Z",
                "kod": "CZK"
            },
            {
                "kurz": 23.4,
                "mnozstvi": 1,
                "timestamp": "2023-05-07T22:00:00.000Z",
                "kod": "EUR"
            }
        ])
    }

    const request = await superoak(app);
    const response = await request
        .get("/currencies")

    if (count == 0) await rates.drop();
    
    assertEquals(Array.isArray(response.body.data), true);
    assertNotEquals(response.body.data.length, 0);
});