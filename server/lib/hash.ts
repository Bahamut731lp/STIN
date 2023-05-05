import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const getPasswordHash = async (input: string) => await bcrypt.hash(input);
export const getPasswordValidity = async (input: string, hash: string) => await bcrypt.compare(input, hash);
export default getPasswordHash;