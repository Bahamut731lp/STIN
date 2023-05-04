import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import * as Login from "../controllers/login.ts"
import * as Register from "../controllers/register.ts"
import * as TwoFactor from "../controllers/2fa.ts"

const router = new Router();

router
    .post("/login", Login.post)
    .post("/register", Register.post)
    .post("/validate", TwoFactor.post)

export default router;