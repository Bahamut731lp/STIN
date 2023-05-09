import { assertEquals, assertExists, assertNotEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import Headers from "../database/headers.ts";

Deno.test("getAuthorization #1: Returns null without provided argument", () => {
    const result = Headers.getAuthorization("");
    assertEquals(result, null);
});

Deno.test("getAuthorization #2: Auth Header without delimiting whitespace returns null", () => {
    const result = Headers.getAuthorization("BasicQWERTZ");
    assertEquals(result, null);
});

Deno.test("getAuthorization #3: Base64 parse error returns null", () => {
    const result = Headers.getAuthorization("Basic {}");
    assertEquals(result, null);
});

Deno.test("getAuthorization #4: Auth Header is missing one part", () => {
    const result = Headers.getAuthorization("Basic ZW1haWw6");
    assertEquals(result, null);
});

Deno.test("getAuthorization #5: Auth Header is correct", () => {
    const result = Headers.getAuthorization("Basic ZW1haWw6dG9rZW4=");
    assertNotEquals(result, null);
    assertExists(result?.email);
    assertExists(result?.token);
});