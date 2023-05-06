import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts"
import DatabaseSchema from './schema.ts'

const DB_PATH = "./db.json"
const DATABASE = new Database<DatabaseSchema>({
    path: DB_PATH,
    pretty: true,
    autoload: true,
    autosave: true,
    optimize: false,
    immutable: true,
});

export default DATABASE;