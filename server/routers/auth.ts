import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import * as Login from "../controllers/auth/login.ts"
import * as Register from "../controllers/auth/register.ts"
import * as TwoFactor from "../controllers/auth/2fa.ts"
import * as Validate from "../controllers/auth/validate.js"

const router = new Router();

router
    .post("/login", Login.post)
    .post("/register", Register.post)
    .post("/twofactor", TwoFactor.post)
    .post("/validate", Validate.post)

export default router;