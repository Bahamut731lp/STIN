import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import Currency from "../database/currency.ts";

export async function get(context: Context) {
    const codes = await Currency.getList();

    context.response.status = 200
    context.response.body = {
        data: codes
    };
}