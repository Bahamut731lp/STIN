import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

import DATABASE from "../database/initialize.ts";
import getPasswordHash from "../lib/hash.ts";
import require from "../lib/require.ts"

export async function post(context: Context) {
    const body = await context.request.body().value
    const hasAllRequiredFields = require(body, "email", "name", "password")

    if (hasAllRequiredFields.status == 400) {
        context.response.status = hasAllRequiredFields.status
        context.response.body = hasAllRequiredFields;
        return;
    }

    if ([body.email, body.name, body.password].every(v => typeof v != "string")) {
        context.response.status = 400
        context.response.body = {
            title: `Malformed Request`,
            detail: `Email, name or password is not string`,
            status: 400,
            data: null
        };
        return;
    }

    const query = await DATABASE.findOne((document) => document.user.email === body.email)
    if (query != null) {
        context.response.status = 409
        context.response.body = {
            title: `User already exists.`,
            detail: `Supplied email is already stored in database.`,
            status: 409,
            data: null
        };
        return;
    }

    const hashedPassword = await getPasswordHash(body.password)

    const response = await DATABASE.insertOne({
        user: {
            email: body.email,
            name: body.name,
            password: hashedPassword
        },
        accounts: []
    })

    response.user.password = "";

    context.response.status = 200
    context.response.body = {
        data: response
    };
}