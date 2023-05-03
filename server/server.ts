import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";



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
//  .get("/beers/:id", getBeerDetails)
//  .post("/beers", createBeer)
//  .put("/beers/:id", updateBeer)
//  .delete("/beers/:id", deleteBeer);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;