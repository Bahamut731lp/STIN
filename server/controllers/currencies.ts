import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import rates from "../database/exchange.ts";

export async function get(context: Context) {
    const codes = (await rates.findMany(() => true)).map(v => v.kod)

    context.response.status = 200
    context.response.body = {
        data: codes
    };
}