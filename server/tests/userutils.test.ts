import { assertEquals } from "https://deno.land/std@0.129.0/testing/asserts.ts";
import User from "../database/user.ts"

Deno.test("User Utils #1: getAccountWithPrefix returns null with non-existing user", async () => {
    const result = await User.getAccountWithPrefix(crypto.randomUUID(), crypto.randomUUID());
    assertEquals(result, null);
});

Deno.test("User Utils #2: getAccountWithPrefix returns null with non-existing account", async () => {
    const email = crypto.randomUUID();
    const discard = await User.createMockUser(email);
    const result = await User.getAccountWithPrefix(email, crypto.randomUUID());

    await discard();
    assertEquals(result, null);
});

Deno.test("User Utils #3: Updating non-existing account returns false", async () => {
    const email = crypto.randomUUID();
    const discard = await User.createMockUser(email);
    const result = await User.updateAccountWithPrefix(email, crypto.randomUUID(), (_) => _);

    await discard();
    assertEquals(result, false);
})