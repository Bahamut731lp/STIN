import { searchDocuments } from "https://deno.land/x/aloedb@0.9.0/lib/core.ts";
import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

import DATABASE from "../database/initialize.ts";
import { getPasswordValidity } from "../lib/hash.ts";
import require from "../lib/require.ts"

export async function post(context: Context) {
    const body = await context.request.body().value
    const hasAllRequiredFields = require(body, "email", "password")

    if (hasAllRequiredFields.status == 400) {
        context.response.status = hasAllRequiredFields.status
        context.response.body = hasAllRequiredFields;
        return;
    }

    if ([body.email, body.password].every(v => typeof v != "string")) {
        context.response.status = 400
        context.response.body = {
            title: `Malformed Request`,
            detail: `Email or password is not string`,
            status: 400,
            data: null
        };
        return;
    }

    const query = await DATABASE.findOne((document) => document.user.email === body.email)
    if (query == null) {
        context.response.status = 404
        context.response.body = {
            title: `E-mail not found`,
            detail: `E-mail ${body.email} is not in database.`,
            status: 404,
            data: null
        };
        return;
    }

    const isPasswordValid = await getPasswordValidity(body.password, query.user.password)
    if (!isPasswordValid) {
        context.response.status = 403
        context.response.body = {
            title: `Incorrect password`,
            detail: `Provided password is incorrect.`,
            status: 403,
            data: null
        };
        return;
    }

    // NO YOINK
    query.user.password = ""

    context.response.status = 200
    context.response.body = {
        data: query
    };
}