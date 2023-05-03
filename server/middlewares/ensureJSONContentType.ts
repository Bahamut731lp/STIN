import { Middleware } from "https://deno.land/x/oak/mod.ts";

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

    await next();
};

export default ensureJSON;