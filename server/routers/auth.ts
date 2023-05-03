import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import * as Login from "../controllers/login.ts"

const router = new Router();

router
    .post("/login", Login.post)
//  .post("/beers", createBeer)
//  .put("/beers/:id", updateBeer)
//  .delete("/beers/:id", deleteBeer);

export default router;