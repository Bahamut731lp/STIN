import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak@4.7.0/mod.ts";

import app from "../server.ts"
import getTwoFactorObject from "../lib/getTwoFactorObject.ts";
import Session from "../database/session.ts";
import User from "../database/user.ts";

Deno.test("getTwoFactorObject #1: Empty argument", () => {
    const result = getTwoFactorObject("");
    assertEquals(null, result)
});

Deno.test("getTwoFactorObject #2: Valid URI in argument", () => {
    const result = getTwoFactorObject("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example");
    assertNotEquals(null, result)
});

Deno.test("2FA #1: No parameters", async () => {
    const request = await superoak(app);
    await request
        .post("/auth/twofactor")
        .set("Content-Type", "application/json")
        .send({})
        .expect(400);
});

Deno.test("2FA #2: No session", async () => {
    const email = crypto.randomUUID();
    const token = "111111";

    const request = await superoak(app);
    await request
        .post("/auth/twofactor")
        .set("Content-Type", "application/json")
        .send({ email, token })
        .expect(404);
});

Deno.test("2FA #3: No user but session exists (should never occure)", async () => {
    const email = crypto.randomUUID();
    const token = "111111";
    const discard = await Session.createMockSession(email, token);

    const request = await superoak(app);
    const result = await request
        .post("/auth/twofactor")
        .set("Content-Type", "application/json")
        .send({ email, token })
    
    await discard();
    assertEquals(result.status, 500);
});

Deno.test("2FA #4: Invalid token submitted", async () => {
    const email = crypto.randomUUID();
    const token = "111111";

    const discardUser = await User.createMockUser(email);
    const discardSession = await Session.createMockSession(email, undefined);

    const request = await superoak(app);
    const result = await request
        .post("/auth/twofactor")
        .set("Content-Type", "application/json")
        .send({ email, token })
    
    await discardUser();
    await discardSession();
    assertEquals(result.status, 401);
});