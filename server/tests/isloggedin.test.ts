import { Context, testing } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import session from "../database/sessions.ts";
import db from "../database/initialize.ts";
import isLoggedIn from "../middlewares/isLoggedIn.ts";

Deno.test("Logged In Middleware #1: Successfully passes if headers are present", async () => {
    //Arrange
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
            name: email,
            password: "",
            secret: {
                uri: ""
            }
        },
        accounts: []
    })

    const ctx = testing.createMockContext({
        path: "/user/",
        headers: [
            ["Authorization", `Basic ${btoa(`${email}:${token}`)}`],
            ["content-type", "application/json"]
        ]
    });
    const next = testing.createMockNext();

    // Act
    await isLoggedIn(ctx as Context, next);

    // Cleanup
    await session.deleteMany((document) => document.email == email);
    await db.deleteMany((document) => document.user.email == email);

    assertNotEquals(ctx.response.status, 400);
    assertNotEquals(ctx.response.status, 401);
});

Deno.test("Logged In Middleware #2: No authentication header present", async () => {
    //Arrange
    const ctx = testing.createMockContext({
        path: "/",
        headers: [
            ["content-type", "application/json"]
        ]
    });
    const next = testing.createMockNext();

    // Act
    await isLoggedIn(ctx as Context, next);

    // Assert
    assertEquals(ctx.response.status, 400);
});

Deno.test("Logged In Middleware #3: Header present, but no session found", async () => {
    //Arrange
    const email = crypto.randomUUID();
    const token = "111111";
    const ctx = testing.createMockContext({
        path: "/",
        headers: [
            ["Authorization", `Basic ${btoa(`${email}:${token}`)}`],
            ["content-type", "application/json"]
        ]
    });

    const next = testing.createMockNext();

    // Act
    await isLoggedIn(ctx as Context, next);

    // Assert
    assertEquals(ctx.response.status, 401);
});