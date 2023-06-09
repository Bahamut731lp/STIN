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

Deno.test("Payment #1: No login", async () => {
    const request = await superoak(app);
    const response = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .send({});

    assertEquals(response.status, 400);
    assertObjectMatch(response.body, { title: "Unauthenticated" })
});

Deno.test("Payment #2: Non-valid login", async () => {
    const request = await superoak(app);
    const response = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", "Basic LOOOOOOL")
        .send({});

    assertEquals(response.status, 401);
    assertObjectMatch(response.body, { title: "Unauthenticated" })
});

Deno.test("Payment #3: No arguments", async () => {
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
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({});

    await sessions.deleteMany((document) => document.expiration == undefined);
    assertEquals(result.status, 400);
});

Deno.test("Payment #4: No user in DB", async () => {
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
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK", amount: 100 });

    await sessions.deleteMany((document) => document.expiration == undefined);
    assertEquals(result.body.title, "No user found")
    assertEquals(result.status, 500);
});

Deno.test("Payment #7: Successfull Transaction (No Conversion)", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    const discardMockUser = await User.createMockUser(email);

    const request = await superoak(app);
    const result = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK", amount: 100 });

    await discardMockUser();
    await sessions.deleteMany((document) => document.expiration == undefined);

    assertEquals(result.status, 200);
});

Deno.test("Payment #8: Paying over the current balance", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    const discardMockUser = await User.createMockUser(email);

    // Víme, že tam ten účet bude, páč jsme ho tam doslova teďko vložili
    // Proto ten vykřičník na konci.
    const mockAccount = (await User.getAccountWithPrefix(email, "000000"))!;

    const request = await superoak(app);
    const result = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK", amount: 1000000000000000, prefix: mockAccount.data.identifier.prefix });

    await discardMockUser();
    await sessions.deleteMany((document) => document.expiration == undefined);

    assertEquals(result.status, 403);
})