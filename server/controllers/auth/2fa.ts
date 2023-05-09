import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import getTwoFactorObject from "../../lib/getTwoFactorObject.ts";
import Session from "../../database/session.ts";
import User from "../../database/user.ts";

interface ExpectedBodyInterface {
    email: string;
    token: string;
}

export async function post(context: Context) {
    //Defaultně v milisekundách, proto takové násobení, abychom to převedli v hodiny
    const TOKEN_VALIDITY = 5 * 3600 * 1000
    const body = await context.request.body().value
    const { email, token } = body as Partial<ExpectedBodyInterface>;

    if (!email || !token) {
        context.response.status = 400
        context.response.body = {
            data: null
        };
        return;
    }

    const session = await Session.get(body.email)
    if (!session) {
        context.response.status = 404;
        context.response.body = {
            title: `No session found`,
            detail: `User ${body.email} has no session to authenticate`,
            status: 404,
            data: null
        };
        return;
    }
    
    const user = await User.get(body.email);
    if (!user) {
        context.response.status = 500
        context.response.body = {
            title: "No user found",
            status: 500,
            data: null
        };
        return;
    }

    const totp = getTwoFactorObject(user.user.secret.uri);
    const isValid = totp?.validate({token: body.token}) != null

    if (!totp || !isValid) {
        context.response.status = 401
        context.response.body = {
            title: "Not a valid token",
            detail: "Token provided in request body is not valid.",
            status: 401,
            data: {
                isValid
            }
        }
        return;
    }

    await Session.update(body.email, (document) => {
        document.token = body.token;
        document.expiration = new Date(new Date().getTime() + TOKEN_VALIDITY).toISOString()
        return document;
    });

    context.response.status = 200
    context.response.body = {
        status: 200,
        data: {
            isValid,
            email: body.email,
            token: totp.generate()
        }
    };
}