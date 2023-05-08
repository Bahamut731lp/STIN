import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Cron } from "https://deno.land/x/croner@6.0.3/dist/croner.js";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import ensureJSONContentType from "./middlewares/ensureJSONContentType.ts";
import isLoggedIn from "./middlewares/isLoggedIn.ts";
import updateRates from "./database/updateRates.ts";
const router = new Router();

import Auth from "./routers/auth.ts"
import User from "./routers/user.ts";
import * as Currencies from "./controllers/currencies.ts"
import * as Root from "./controllers/root.ts"
import * as Ping from "./controllers/ping.ts"
import * as Database from "./controllers/database.ts"

router
    .get("/", Root.get)
    .get("/ping", Ping.get)
    .get("/db", Database.get)
    .get("/currencies", Currencies.get)
    .use("/user", isLoggedIn, User.routes())
    .use("/auth", Auth.routes())

const app = new Application();
app.use(oakCors())
app.use(ensureJSONContentType);
app.use(router.routes());
app.use(router.allowedMethods());


const rateJob = new Cron("40 14-16 * * 1-5", updateRates);

//Prvotní spuštění úlohy pro hledání nového kurzu
rateJob.trigger();

export default app;