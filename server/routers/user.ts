import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

import * as User from "../controllers/user/user.ts"
import * as Account from "../controllers/user/account.ts"
import * as Deposit from "../controllers/user/deposit.ts"
import * as Payment from "../controllers/user/payment.ts"

const router = new Router();

router
    .get("/", User.get)
    .post("/account/new", Account.post)
    .post("/account/deposit", Deposit.post)
    .post("/account/pay", Payment.post)

export default router;