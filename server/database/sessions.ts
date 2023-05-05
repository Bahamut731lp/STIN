import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"

/*
    In-memory databáze pro právě aktivní sessions po přihlášení.
*/

const DB_PATH = "./sessions.json"

interface Session {
    email: string;
    token?: string;
    expiration?: string;
}

const SESSIONS = new Database<Session>({
    path: DB_PATH,
    pretty: true,
    autoload: true,
    autosave: true,
    optimize: true,
    immutable: true,
});
export default SESSIONS;