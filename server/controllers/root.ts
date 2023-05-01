import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

export async function get(context: Context) {
    const configuration = await config();
    const { VERSION } = configuration;

    context.response.status = 200
    context.response.body = {
        version: VERSION ?? "Not defined"
    };
}