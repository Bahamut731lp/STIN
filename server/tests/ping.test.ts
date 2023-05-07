import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import app from "../server.ts"

Deno.test("Ping #1: Response has status 200", async () => {
    const request = await superoak(app);
    await request
    .get("/ping")
    .set("Content-Type", "application/json")
    .expect(200);
});

Deno.test("Ping #2: Response is in correct format", async () => {
    const request = await superoak(app);
    await request.get("/ping")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect({data: "Pong!"});
});

Deno.test("Root #1: Response is in correct format", async () => {
    const request = await superoak(app);
    await request.get("/")
    .expect(200)
});