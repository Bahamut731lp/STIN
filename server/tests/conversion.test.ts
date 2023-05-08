import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import getConversion from "../lib/getConversion.ts";
import rates from "../database/exchange.ts";

Deno.test("getConversion #1: Empty arguments", async () => {
    const result = await getConversion("", "", NaN);
    assertEquals(null, result)
});

Deno.test("getConversion #2: Non-existing currencies", async () => {
    const a = crypto.randomUUID();
    const b = crypto.randomUUID();

    const result = await getConversion(a, b, 1500);
    assertEquals(result, null);
});

Deno.test("getConversion #3: Successfully convert", async (test) => {
    await test.step("Check if database has any usable rates", async () => {
        const count = await rates.count();
        assertNotEquals(count, 0);
    });

    await test.step("Check if database has any usable rates", async () => {
        const rate = await rates.findOne(() => true);
        const amount = 1500;
        const conversion = await getConversion(rate!.kod, rate!.kod, amount);
        assertEquals(conversion!.result, amount);
    });
});