import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import * as Login from "../controllers/login.ts"
import * as Register from "../controllers/register.ts"

const router = new Router();

router
    .post("/login", Login.post)
    .post("/register", Register.post)

export default router;