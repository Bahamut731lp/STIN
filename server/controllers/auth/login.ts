import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { getPasswordValidity } from "../../lib/hash.ts";
import Session from "../../database/session.ts";
import User from "../../database/user.ts";

interface ExpectedBody {
    email: string;
    password: string;
}

export async function post(context: Context) {
    const body = await context.request.body().value
    const {email, password} = body as Partial<ExpectedBody>
    
    if (!email || !password) {
        context.response.status = 400
        context.response.body = {
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

    const session = await Session.get(body.email);
    if (session != null) {        
        if (session.token == undefined) {
            context.response.status = 200;
            context.response.body = {
                status: 200,
                data: {
                    twofactor: false
                },
            };
            return;
        }
        else {
            context.response.status = 200;
            user.twofactor = true;
            context.response.body = {
                status: 200,
                data: user
            };
        }
        
        return;
    }

    const isPasswordValid = await getPasswordValidity(body.password, user.user.password)
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
    
    await Session.create(body.email)

    // NO YOINK
    user.user.password = ""    
    context.response.status = 200
    context.response.body = {
        status: 200,
        data: {
            twofactor: false
        }
    };
}