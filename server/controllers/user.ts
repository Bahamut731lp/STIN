import { Context } from "https://deno.land/x/oak@v11.1.0/context.ts";
import db from "../database/initialize.ts";

export async function get(context: Context) {
    const requestURL = context.request.url
    const email = requestURL.searchParams.get("email");
    
    if (!email) {
        context.response.status = 400;
        context.response.body = {
            title: "No email query provided",
            detail: `Email must be provided as query parameter`,
            data: null,
        }
    }

    const result = await db.findOne((document) => document.user.email == email);

    //Sanitace, páč tohle tam fakt úplně nepotřebujem...
    if (result != null) {
        result.user.password = "";
        result.user.secret = { uri: "" };
    }

    context.response.status = 200
    context.response.body = {
        data: result
    };
}