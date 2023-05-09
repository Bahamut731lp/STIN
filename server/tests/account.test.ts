import { assertEquals, assertObjectMatch } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import sessions from "../database/sessions.ts";
import User from "../database/user.ts";
import app from "../server.ts"

async function createMockSession(email: string, token: string) {
    await sessions.insertOne({
        email,
        token,
        expiration: undefined
    });
}

Deno.test("Account #1: No login", async () => {
    const request = await superoak(app);
    const response = await request
        .post("/user/account/new")
        .set("Content-Type", "application/json")
        .send({});

    assertEquals(response.status, 400);
    assertObjectMatch(response.body, { title: "Unauthenticated" })
});

Deno.test("Account #2: Non-valid login", async () => {
    const request = await superoak(app);
    const response = await request
        .post("/user/account/new")
        .set("Content-Type", "application/json")
        .set("Authorization", "Basic LOOOOOOL")
        .send({});

    assertEquals(response.status, 401);
    assertObjectMatch(response.body, { title: "Unauthenticated" })
});

Deno.test("Account #3: No arguments", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await sessions.insertOne({
        email,
        token,
        expiration: undefined
    });

    const request = await superoak(app);
    const result = await request
        .post("/user/account/new")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({});

    await sessions.deleteMany((document) => document.expiration == undefined);
    assertEquals(result.status, 400);
});

Deno.test("Account #4: No user in DB", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await sessions.insertOne({
        email,
        token,
        expiration: undefined
    });

    const request = await superoak(app);
    const result = await request
        .post("/user/account/new")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK" });

    await sessions.deleteMany((document) => document.expiration == undefined);
    assertEquals(result.body.title, "No user found")
    assertEquals(result.status, 500);
});

Deno.test("Account #5: Successfully creating new account", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    const discardMockUser = await User.createMockUser(email);

    const request = await superoak(app);
    const result = await request
        .post("/user/account/new")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK" });

    await discardMockUser();
    await sessions.deleteMany((document) => document.expiration == undefined);

    assertEquals(result.status, 200);
});