import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import DATABASE from "../database/initialize.ts";

export async function post(context: Context) {
    const body = await context.request.body().value

    context.response.status = 200
    context.response.body = body;
}