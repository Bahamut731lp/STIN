import { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Headers from "../database/headers.ts";
import Session from "../database/session.ts";

const isLoggedIn: Middleware = async (ctx, next) => {
    const auth = ctx.request.headers.get("authorization");

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

    const credentials = Headers.getAuthorization(auth)
    if (!credentials) {
        ctx.response.status = 401
        ctx.response.type = "application/json"
        ctx.response.body = {
            title: "Unauthenticated",
            detail: `To perform this operation, request must bear proper authorization header`,
            status: 401
        }

        return;
    }

    const session = await Session.get(credentials.email);
    if (!session) {
        ctx.response.status = 401
        ctx.response.type = "application/json"
        ctx.response.body = {
            title: "No session found",
            status: 401
        }

        return; 
    }

    await next();
    return;
};

export default isLoggedIn;