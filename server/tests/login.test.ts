import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import db from "../database/initialize.ts";
import Session from "../database/session.ts";
import User from "../database/user.ts";
import getPasswordHash from "../lib/hash.ts";
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
        .send({ "email": new Date().toISOString(), "password": new Date().toISOString() })
        .expect(500);
});

Deno.test("Login #4: Successful login flow", async () => {
    // Arrange
    const email = crypto.randomUUID();
    const password = "123456789";
    const discard = await User.createMockUser(email, password);

    const request = await superoak(app);
    const result = await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password });

    await discard();
    assertEquals(result.status, 200);
});

Deno.test("Login #5: Session already exists", async () => {
    const email = crypto.randomUUID();
    const password = "123456789";
    const token = "111111";

    const discardUser = await User.createMockUser(email, password);
    const discardSession = await Session.createMockSession(email, token, true)
    
    const request = await superoak(app);
    const result = await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password });

    await discardUser();
    await discardSession();

    assertEquals(result.status, 200);
    assertEquals(result.body.data.twofactor, true);
});

Deno.test("Login #6: Session already exists, but is not 2FA'd", async () => {
    const email = crypto.randomUUID();
    const password = "123456789";

    const discardUser = await User.createMockUser(email, password);
    const discardSession = await Session.createMockSession(email, undefined)
    
    const request = await superoak(app);
    const result = await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password });

    await discardUser();
    await discardSession();

    assertEquals(result.status, 200);
    assertEquals(result.body.data.twofactor, false);
});

Deno.test("Login #7: Wrong password", async () => {
    const email = crypto.randomUUID();
    const password = "123456789";
    const discardUser = await User.createMockUser(email, password);
    
    const request = await superoak(app);
    const result = await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password: "LOOOOOL" });

    await discardUser();

    assertEquals(result.status, 403);
});
