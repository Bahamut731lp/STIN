import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import getUser from "../database/getUser.ts";

import DATABASE from "../database/initialize.ts";
import SESSIONS from "../database/sessions.ts";

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
    
    const query = await getUser(body.email)

    if (query.data == null) {
        context.response.status = query.status;
        context.response.body = query;
        return;
    }

    const session = await SESSIONS.findOne((document) => document.email == body.email)

    if (session != null) {        
        if (session.token == undefined) {
            context.response.status = 401;
            context.response.body = {
                title: `Not authorized by second factor`,
                detail: `Check your email for 2FA code.`,
                status: 401,
                data: {
                    twofactor: false
                },
            };
            return;
        }
        else {
            context.response.status = 200;
            query.data.twofactor = true;
            context.response.body = {
                status: 200,
                data: query.data
            };
        }
        
        return;
    }

    const isPasswordValid = await getPasswordValidity(body.password, query.data.user.password)
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
    query.data.user.password = ""

    await SESSIONS.insertOne({
        email: body.email,
        token: undefined
    });

    await SESSIONS.save()
    
    context.response.status = 200
    context.response.body = {
        status: 200,
        data: {
            twofactor: false
        }
    };
}