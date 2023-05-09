import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"

/*
    In-memory databáze pro právě aktivní sessions po přihlášení.
*/

interface ExchangeRate {
    timestamp: string;
    kod: string;
    mnozstvi: number;
    kurz: number;
    
}

const rates = new Database<ExchangeRate>({
    path: "./rates.json",
    pretty: true,
    autoload: true,
    autosave: true,
    optimize: false,
    immutable: true,
});

export default rates;