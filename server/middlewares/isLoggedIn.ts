import { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import SESSIONS from "../database/sessions.ts";

const isLoggedIn: Middleware = async (ctx, next) => {
    const auth: string | null = ctx.request.headers.get("authorization");

    if (!auth) {
        ctx.response.status = 400
        ctx.response.type = "application/json"
        ctx.response.body = {
            title: "Unauthenticated",
            detail: `To perform this operation, request must bear proper authorization header`,
            status: 400
        }

        return;
    }

    try {
        const data = auth.split(/\s+/gi).pop();
        const login = atob(data as string);
        const [email, token] = login.split(":");

        const result = await SESSIONS.findOne((document) => document.email == email && document.token == token);
        if (!result) throw new Error();

        await next();
        return;

    } catch (_) {
        ctx.response.status = 401
        ctx.response.type = "application/json"
        ctx.response.body = {
            title: "Unauthenticated",
            detail: `To perform this operation, request must bear proper authorization header`,
            status: 401
        }

        return;
    }
};

export default isLoggedIn;