import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import Session from "../../database/session.ts";

interface ExpectedBodyInterface {
    email: string;
    token: string;
}

export async function post(context: Context) {
    const body = await context.request.body().value
    const {email, token} = body as Partial<ExpectedBodyInterface>
    
    if (!email || !token) {
        context.response.status = 400
        context.response.body = {
            title: "Missing parameters",
            detail: "",
            data: null
        };
        return;
    }

    const session = await Session.get(body.email);
    if (!session) {
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

    const isValidSession = await Session.isValid(email);
    if (!isValidSession) {
        await Session.delete(body.email);

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