import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const router = new Router();

import * as Root from "./controllers/root.ts"
import * as Ping from "./controllers/ping.ts"

router
    .get("/", Root.get)
    .get("/ping", Ping.get)
//  .get("/beers/:id", getBeerDetails)
//  .post("/beers", createBeer)
//  .put("/beers/:id", updateBeer)
//  .delete("/beers/:id", deleteBeer);

//TODO: Testovácí cest.
//https://dev.to/craigmorten/testing-your-deno-oak-server-applications-bdb

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;