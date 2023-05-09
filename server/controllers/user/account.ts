import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import Headers from "../../database/headers.ts";
import User from "../../database/user.ts";

interface ExpectedBodyInterface {
    currency: string;
}

export async function post(context: Context) {
    const body = await context.request.body().value;
    const credentials = Headers.getAuthorization(context.request.headers.get("authorization"))
    const { currency } = body as Partial<ExpectedBodyInterface>;

    if (!credentials || !currency) {
        context.response.status = 400
        context.response.body = {
            data: null
        };
        return;
    }

    const user = await User.get(credentials.email);
    if (!user) {
        context.response.status = 500
        context.response.body = {
            title: "No user found",
            status: 500,
            data: null
        };
        return;
    }

    await User.getNewAccount(credentials.email, currency);

    context.response.status = 200
    context.response.body = {
        data: "ok"
    };

    return;
}