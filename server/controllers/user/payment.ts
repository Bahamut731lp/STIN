import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import db from "../../database/initialize.ts";

export async function post(context: Context) {
    const body = await context.request.body().value;
    const [email] = atob(context.request.headers.get("authorization")?.split(/\s+/gi)?.pop() ?? "")?.split(":") ?? [null, null];

    const {currency, amount, prefix} = body;

    if (!currency || !amount || !prefix) {
        context.response.status = 400
        context.response.body = {
            data: null
        };
        return;
    }

    const user = await db.findOne((document) => document.user.email == email);
    if (!user) {
        context.response.status = 500
        context.response.body = {
            data: null
        };
        return;
    }

    const index = user.accounts.findIndex((acc) => acc.identifier.prefix == prefix);
    await db.updateOne(
        (document) => document.user.email == email,
        (document) => {
            document.accounts[index].amount -= amount;
            document.accounts[index].history.push({
                type: "payment",
                amount: amount,
                date: new Date().toISOString(),
                conversion: {
                    from: currency,
                    to: currency,
                    rate: 1
                }
            })

            return document;
        }
    )

    context.response.status = 200
    context.response.body = {
        data: "ok",
        status: 200
    };

    return;
}