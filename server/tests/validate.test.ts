import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";
import Session from "../database/session.ts";
import app from "../server.ts"

Deno.test("Validation #1: No parameters", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({})
        .expect(400);
});

Deno.test("Validation #2: Only one parameter supplied", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({ "email": "test@test.com" })
        .expect(400);
});

Deno.test("Validation #3: Non-existing session", async () => {
    const email = crypto.randomUUID();
    const token = "111111";

    const request = await superoak(app);
    await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({ email, token })
        .expect(404);
});

Deno.test("Validation #4: Not existing token", async () => {
    const email = crypto.randomUUID();
    const token = "111111";

    const discard = await Session.createMockSession(email, token);

    const request = await superoak(app);
    const result = await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({ email, token: crypto.randomUUID() });

    await discard();
    assertEquals(result.status, 403);
});

Deno.test("Validation #5: Invalid Session", async () => {
    const email = crypto.randomUUID();
    const token = "111111";

    const discard = await Session.createMockSession(email, token);

    const request = await superoak(app);
    const result = await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({ email, token });

    await discard();
    assertEquals(result.status, 401);
});

Deno.test("Validation #6: Valid session returns 200", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    const valid = true;

    const discard = await Session.createMockSession(email, token, valid);

    const request = await superoak(app);
    const result = await request
        .post("/auth/validate")
        .set("Content-Type", "application/json")
        .send({ email, token });

    await discard();
    assertEquals(result.status, 200);
});