import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import { assert } from "https://deno.land/std@0.186.0/testing/asserts.ts";

import db from "../database/initialize.ts";
import app from "../server.ts"
import { assertNotEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("Register #1: No request body", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({})
        .expect(400);
});

Deno.test("Register #2: Only one parameter supplied", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ "email": "test@test.com" })
        .expect(400);
});

Deno.test("Register #3: Successfully creating a user", async (test) => {
    // Arrange
    const email = new Date().toISOString();

    // Act
    await test.step("Request registration", async () => {
        const request = await superoak(app);
        await request
            .post("/auth/register")
            .set("Content-Type", "application/json")
            .send({ "email": email, "password": "123456", "name": email })
            .expect(200);
    })

    // Assert
    await test.step("Check database", async () => {
        const result = await db.findOne((document) => document.user.email == email)
        assertNotEquals(result, null);

    })

    await db.deleteOne((document) => document.user.email == email)
});

Deno.test("Register #4: Creating already existing user", async (test) => {
    // Arrange
    const email = new Date().toISOString();

    // Act
    await test.step("Successfully creating user", async () => {
        const request = await superoak(app);
        await request
            .post("/auth/register")
            .set("Content-Type", "application/json")
            .send({ "email": email, "password": "123456", "name": email })
            .expect(200);
    })
    
    // Assert
    await test.step("Creating user again and checking that it returns 409", async () => {
        const request = await superoak(app);
        await request
            .post("/auth/register")
            .set("Content-Type", "application/json")
            .send({ "email": email, "password": "123456", "name": email })
            .expect(409);
    })
    
    await db.deleteOne((document) => document.user.email == email)
});