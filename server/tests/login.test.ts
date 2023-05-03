import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import app from "../server.ts"

Deno.test("Login #1: No parameters", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .set("Content-Type", "application/json")
    .send({})
    .expect(400);
});

Deno.test("Login #2: Only one parameter supplied", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .set("Content-Type", "application/json")
    .send({ "email": "test@test.com" })
    .expect(400);
});

Deno.test("Login #3: Correct response to non-existing e-mail", async () => {
    const request = await superoak(app);
    await request
    .post("/auth/login")
    .set("Content-Type", "application/json")
    .send({"email": new Date().toISOString(), "password": new Date().toISOString() })
    .expect(404);
});