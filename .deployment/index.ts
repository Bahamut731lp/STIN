import { Application, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";

const env = await load();
if (!env["PASSWORD"] || !env["USERNAME"]) throw new Error();

async function runBuild() {
    const response = await new Deno.Command("docker-compose", { args: ["up", "-d", "--force-recreate"] }).output();
    console.log(response)
}

async function handle(ctx: Context) {
    if (!ctx.request.hasBody) {
        console.log(new Date().toLocaleString(), "Request without body.");
        ctx.response.status = 400;
        return;
    }

    const body = await ctx.request.body().value;
    try {
        const { username, password } = body;
        if (!username || !password) {
            console.log(new Date().toLocaleString(), "Bad credentials.");
            throw new Error();
        }
        if (password == env["PASSWORD"] && username == env["USERNAME"]) {
            console.log(new Date().toLocaleString(), "Authenticated request, running build.");
            runBuild();
            ctx.response.status = 200;
            return;
        }
        else {
            console.log(new Date().toLocaleString(), "Unauthenticated request.");
            ctx.response.status = 403;
            return;
        }

    } catch (_) {
        console.log(_);
        console.log(new Date().toLocaleString(), "Malformed request.");
        ctx.response.status = 400;
        return;
    }
}

const app = new Application();
const router = new Router();

router
    .post("/", handle)

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Running deployment webhook on 8001")
await app.listen({ port: 8001 });