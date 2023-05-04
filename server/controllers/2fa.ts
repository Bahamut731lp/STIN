import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

import SESSIONS from "../database/sessions.ts";
import require from "../lib/require.ts"
import getUser from "../database/getUser.ts"
import getTwoFactorObject from "../lib/getTwoFactorObject.ts";

export async function post(context: Context) {
    const body = await context.request.body().value
    const hasAllRequiredFields = require(body, "email", "token")

    if (hasAllRequiredFields.status == 400) {
        context.response.status = hasAllRequiredFields.status
        context.response.body = hasAllRequiredFields;
        return;
    }

    if ([body.email, body.token].every(v => typeof v != "string")) {
        context.response.status = 400
        context.response.body = {
            title: `Malformed Request`,
            detail: `Email or password is not string`,
            status: 400,
            data: null
        };
        return;
    }

    const session = await SESSIONS.findOne((document) => document.email === body.email)

    if (session == null) {
        context.response.status = 404;
        context.response.body = {
            title: `No session found`,
            detail: `User ${body.email} has no session to authenticate`,
            status: 404,
            data: null
        };
        return;
    }
    
    const query = await getUser(body.email)
    const totp = getTwoFactorObject(query.data!.user.secret.uri ?? "")
    const isValid = totp.validate({token: body.token}) != null

    if (!isValid) {
        context.response.status = 401
        context.response.body = {
            title: "Not a valid token",
            detail: "Token provided in request body is not valid.",
            status: 401,
            data: null
        }
        return;
    }

    await SESSIONS.updateOne((document) => document.email == body.email, (document) => {
        document.token = body.token
        return document;
    });

    context.response.status = 200
    context.response.body = {
        data: {
            isValid,
            token: totp.generate()
        }
    };
}