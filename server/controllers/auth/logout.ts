import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import Session from "../../database/session.ts";
import Headers from "../../database/headers.ts";

export async function post(context: Context) {
    const credentials = Headers.getAuthorization(context.request.headers.get("authorization"))

    if (!credentials) {
        context.response.status = 400
        context.response.body = {
            title: "Invalid credentials",
            data: null
        };
        return;
    }

    const session = await Session.get(credentials.email);
    if (!session) {
        context.response.status = 404
        context.response.body = {
            status: 404,
            title: "No session found",
            detail: `No valid session found for ${credentials.email}`,
            data: null
        };
        return;
    }

    if (credentials.token != session.token) {
        context.response.status = 403
        context.response.body = {
            status: 403,
            title: "Invalid Token",
            detail: `Provided token is not valid.`,
            data: null
        };
        return;
    }

    await Session.delete(credentials.email);

    context.response.status = 200
    context.response.body = {
        data: {
            status: 200,
            data: true
        }
    };
}