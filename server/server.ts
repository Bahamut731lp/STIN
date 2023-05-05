import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import ensureJSONContentType from "./middlewares/ensureJSONContentType.ts";


const router = new Router();

import auth_router from "./routers/auth.ts"
import * as Root from "./controllers/root.ts"
import * as Ping from "./controllers/ping.ts"
import * as Database from "./controllers/database.ts"

router
    .get("/", Root.get)
    .get("/ping", Ping.get)
    .get("/db", Database.get)
    .use("/auth", auth_router.routes())

const app = new Application();
app.use(oakCors())
app.use(ensureJSONContentType);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;