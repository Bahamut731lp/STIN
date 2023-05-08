import { assertEquals, assertObjectMatch } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import db from "../database/initialize.ts";
import sessions from "../database/sessions.ts";
import User from "../database/user.ts";
import app from "../server.ts"

async function createMockUser(email: string) {
    await db.insertOne({
        user: {
            email,
            name: email,
            password: "",
            secret: {
                uri: ""
            }
        },
        accounts: [{
            amount: 0,
            currency: "CZK",
            history: [],
            identifier: {
                bank: "0666",
                base: "",
                prefix: "000000"
            }
        }]
    })

}

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
        .send({ currency: "CZK", amount: 100, prefix: "00000" });

    console.log(result);

    await sessions.deleteMany((document) => document.expiration == undefined);
    assertEquals(result.body.title, "No user found")
    assertEquals(result.status, 500);
});

Deno.test("Payment #5: Bad user account", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    await createMockUser(email);

    const request = await superoak(app);
    const result = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK", amount: 100, prefix: email });

    await db.deleteMany((document) => document.user.email == email);
    await sessions.deleteMany((document) => document.expiration == undefined);
    
    assertEquals(result.body.title, "Account does not exist");
    assertEquals(result.status, 400);
});

Deno.test("Payment #6: Nonexistent Currency", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    await createMockUser(email);

    // Víme, že tam ten účet bude, páč jsme ho tam doslova teďko vložili
    // Proto ten vykřičník na konci.
    const mockAccount = (await User.getAccountWithPrefix(email, "000000"))!;

    const request = await superoak(app);
    const result = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: email, amount: 100, prefix: mockAccount.data.identifier.prefix });

    await db.deleteMany((document) => document.user.email == email);
    await sessions.deleteMany((document) => document.expiration == undefined);

    assertEquals(result.body.title, "Conversion failed");
    assertEquals(result.status, 400);
});

Deno.test("Payment #6: Successfull Transaction (No Conversion)", async () => {
    const email = crypto.randomUUID();
    const token = "111111"
    const auth = `Basic ${btoa(`${email}:${token}`)}`

    await createMockSession(email, token);
    await createMockUser(email);

    // Víme, že tam ten účet bude, páč jsme ho tam doslova teďko vložili
    // Proto ten vykřičník na konci.
    const mockAccount = (await User.getAccountWithPrefix(email, "000000"))!;

    const request = await superoak(app);
    const result = await request
        .post("/user/account/pay")
        .set("Content-Type", "application/json")
        .set("Authorization", auth)
        .send({ currency: "CZK", amount: 100, prefix: mockAccount.data.identifier.prefix });

    await db.deleteMany((document) => document.user.email == email);
    await sessions.deleteMany((document) => document.expiration == undefined);

    assertEquals(result.status, 200);
});