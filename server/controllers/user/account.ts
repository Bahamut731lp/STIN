import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import db from "../../database/initialize.ts";
import DatabaseSchema from "../../database/schema.js";

function getPrefixNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

export async function post(context: Context) {
    console.log("ACCOUNT POST 0!", context.request.headers.get("authorization"));
    const body = await context.request.body().value;
    const [email] = atob(context.request.headers.get("authorization")?.split(/\s+/gi)?.pop() ?? "")?.split(":") ?? [null, null];
    
    const currency = body.currency
    if (!currency) {
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

    let prefix: string;

    do {
        prefix = String(getPrefixNumber());
    } while (user.accounts.find((v) => v.identifier.prefix == prefix) != undefined);

    const base = user.accounts[0].identifier.base;
    await db.updateOne(
        (document) => document.user.email == email,
        (document) => {
            document.accounts.push({
                amount: 0,
                currency,
                history: [],
                identifier: {
                    prefix,
                    base,
                    bank: "0666"
                }
            });

            return document;
        }
    );

    console.log("ACCOUNT POST 5!");

    return;
}