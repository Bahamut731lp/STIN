import { Middleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const ensureJSON: Middleware = async (ctx, next) => {
    const contentType = ctx.request.headers.get("content-type")

    if (contentType != "application/json") {
        ctx.response.status = 415
        ctx.response.type = "application/json"
        ctx.response.body = {
            title: "Unsupported Content-Type",
            detail: `Supplied Content-Type header (${contentType}) is not supported.`,
            status: 415
        }

        return;
    }

    if (ctx.request.hasBody) {
        try {
            const body = await ctx.request.body().value;
            JSON.parse(JSON.stringify(body));
        }
        catch(_) {
            ctx.response.status = 400
            ctx.response.type = "application/json"
            ctx.response.body = {
                title: "Malformed JSON Body",
                detail: `Supplied body is malformed.`,
                status: 400
            }    
            return;
        }
    }

    await next();
};

export default ensureJSON;