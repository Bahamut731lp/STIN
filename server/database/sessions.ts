import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"

/*
    In-memory databáze pro právě aktivní sessions po přihlášení.
*/

interface Session {
    email: string;
    token?: string;
}

const SESSIONS = new Database<Session>();
export default SESSIONS;