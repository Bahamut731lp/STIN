import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import app from "../server.ts"

Deno.test("JSON Middleware #1: No parameters", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .expect(415);
});

Deno.test("JSON Middleware #2: Malformed JSON", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .set("Content-Type", "application/json")
    .send('{"email: "test@test.com" }')
    .expect(400);
});

Deno.test("JSON Middleware #3: Different Content Type", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .set("Content-Type", "application/xml")
    .send('{"email: "test@test.com" }')
    .expect(400);
});