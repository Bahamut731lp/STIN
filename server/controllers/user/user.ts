import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import db from "../../database/initialize.ts";
import Session from "../../database/session.ts";

export async function get(context: Context) {
    const requestURL = context.request.url
    const email = requestURL.searchParams.get("email");
    
    if (!email) {
        context.response.status = 400;
        context.response.body = {
            title: "No email query provided",
            detail: `Email must be provided as query parameter`,
            data: null,
        }
    }

    const session = await Session.get(email);
    if (!session) {
        context.response.status = 403;
        context.response.body = {
            title: "No session found",
            detail: ``,
            data: null,
        }
    }

    const result = await db.findOne((document) => document.user.email == email);

    if (result == null) {
        context.response.status = 404;
        context.response.body = {
            title: "No email found",
            detail: `Email not found in database`,
            data: null,
        }

        return;
    }

    result.user.password = "";
    result.user.secret = { uri: "" };
    
    context.response.status = 200
    context.response.body = {
        data: result
    };
}