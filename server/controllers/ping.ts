import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";

export function get(context: Context) {
    context.response.status = 200
    context.response.body = {
        data: "Pong!"
    };
}