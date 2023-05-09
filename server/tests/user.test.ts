import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import db from "../database/initialize.ts";
import session from "../database/sessions.ts";
import app from "../server.ts"
import getPasswordHash from "../lib/hash.ts";
import Session from "../database/session.ts";
import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";

Deno.test("User #1: No query params", async () => {
    const request = await superoak(app);
    await request
        .get("/user/")
        .expect(400);
});

Deno.test("User #2: Try non-existing user", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    
    const discard = await Session.createMockSession(email, token);

    const request = await superoak(app);
    const result = await request
        .get(`/user/?email=${email}`)
        .set("Authorization", `Basic ${btoa(`${email}:${token}`)}`);

    await discard();

    assertEquals(result.status, 404);
});

Deno.test("User #3: Try existing user", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    
    await session.insertOne({
        email,
        token,
        expiration: ""
    });

    await db.insertOne({
        user: {
            email,
            name: "",
            password: "",
            secret: {
                uri: ""
            }
        },
        accounts: []
    });

    const request = await superoak(app);
    await request
        .get(`/user/?email=${email}`)
        .set("Authorization", `Basic ${btoa(`${email}:${token}`)}`)
        .expect(200)

    await db.deleteMany((document) => document.user.email == email)
    await session.deleteMany((document) => document.email == email)
});

Deno.test("User #4: Successful login flow", async () => {
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