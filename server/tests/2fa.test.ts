import { assertEquals, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import getTwoFactorObject from "../lib/getTwoFactorObject.ts";

Deno.test("getTwoFactorObject #1: Empty argument", () => {
    const result = getTwoFactorObject("");
    assertEquals(null, result)
});

Deno.test("getTwoFactorObject #2: Valid URI in argument", () => {
    const result = getTwoFactorObject("otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example");
    assertNotEquals(null, result)
});