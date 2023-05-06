import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import db from "../database/initialize.ts";
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
        .expect(404);
});

Deno.test("Login #4: Successful login flow", async () => {
    // Arrange
    const email = crypto.randomUUID();
    const password = "123456789";
    const mockUser = {
        user: {
            email,
            password: await getPasswordHash(password),
            name: "",
            secret: {
                uri: ""
            }
        },
        accounts: []
    }

    await db.insertOne(mockUser)

    const request = await superoak(app);
    await request
        .post("/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password })
        .expect(200);

    await db.deleteOne((document) => document.user.email == email)
});