import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"

/*
    In-memory databáze pro právě aktivní sessions po přihlášení.
*/

const SESSIONS = new Database();
export default SESSIONS;