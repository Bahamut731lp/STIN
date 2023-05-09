import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import app from "../server.ts"

Deno.test("Currencies #1: Result is a array of strings", async () => {
    const request = await superoak(app);
    const response = await request
        .get("/currencies")

    assertEquals(Array.isArray(response.body.data), true);
    assertNotEquals(response.body.data.length, 0);
});