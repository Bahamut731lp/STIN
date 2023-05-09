import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"

/*
    In-memory databáze pro právě aktivní sessions po přihlášení.
*/

export interface ISession {
    email: string;
    token?: string;
    expiration?: string;
}

const sessions = new Database<ISession>({
    path: "./sessions.json",
    pretty: true,
    autoload: true,
    autosave: true,
    optimize: false,
    immutable: true,
});
export default sessions;