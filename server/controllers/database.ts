import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import DATABASE from "../database/initialize.ts";

export async function get(context: Context) {
    const count = await DATABASE.count();

    context.response.status = 200
    context.response.body = {
        data: count
    };
}