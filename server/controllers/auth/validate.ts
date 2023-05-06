import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import SESSIONS from "../../database/sessions.ts";

export async function post(context: Context) {
    const body = await context.request.body().value

    //TODO: Check body

    const session = await SESSIONS.findOne((document) => document.email == body.email)
    if (session == null) {
        context.response.status = 404
        context.response.body = {
            status: 404,
            title: "No session found",
            detail: `No valid session found for ${body.email}`,
            data: null
        };
        return;
    }

    if (body.token != session.token) {
        context.response.status = 403
        context.response.body = {
            status: 403,
            title: "Invalid Token",
            detail: `Provided token is not valid.`,
            data: null
        };
        return;
    }

    if (new Date(String(session.expiration ?? "")) < new Date()) {
        await SESSIONS.deleteOne((document) => document.email == body.email)

        context.response.status = 401
        context.response.body = {
            status: 401,
            title: "Token expired",
            detail: `Session for ${body.email} has already expired.`,
            data: null
        };
        return;
    }

    context.response.status = 200
    context.response.body = {
        data: session
    };
}