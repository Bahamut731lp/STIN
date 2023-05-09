import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import Session from "../database/session.ts";
import app from "../server.ts"

Deno.test("Logout #1: No auth header", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/logout")
        .set("Content-Type", "application/json")
        .send({})
        .expect(400);
});

Deno.test("Logout #2: Invalid session supplied", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/logout")
        .set("Content-Type", "application/json")
        .set("Authorization", `Basic ${btoa("email:token")}`)
        .send({})
        .expect(404);
});

Deno.test("Logout #3: Existing session, but wrong credentials", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    const discard = await Session.createMockSession(email, token);
    
    const request = await superoak(app);
    const result = await request
        .post("/auth/logout")
        .set("Content-Type", "application/json")
        .set("Authorization", `Basic ${btoa(`${email}:token`)}`)
        .send({});

    await discard();
    assertEquals(result.status, 403);
});

Deno.test("Logout #4: Correctly delete session", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    const discard = await Session.createMockSession(email, token);
    
    const request = await superoak(app);
    const result = await request
        .post("/auth/logout")
        .set("Content-Type", "application/json")
        .set("Authorization", `Basic ${btoa(`${email}:${token}`)}`)
        .send({});

    await discard();
    assertEquals(result.status, 200);
});