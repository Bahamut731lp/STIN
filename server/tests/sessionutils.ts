import Session from "../database/session.ts";
import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";

Deno.test("Session Utils #1: Updating non-existing user yields false", async () => {
    const email = crypto.randomUUID();
    const result = await Session.update(email, (_) => _);

    assertEquals(result, false);
});