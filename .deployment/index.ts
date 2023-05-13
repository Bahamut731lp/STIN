import { Application, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";

const env = await load();
if (!env["PASSWORD"] || !env["USERNAME"]) throw new Error();

async function runBuild() {
    const process = Deno.run({
        cmd: ["docker-compose", "up", "-d", "--force-recreate"]
    });

    await process.status();
}

async function handle(ctx: Context) {
    if (!ctx.request.hasBody) {
        ctx.response.status = 400;
        return;
    }

    const body = await ctx.request.body().value;
    try {
        const json = JSON.parse(JSON.stringify(body));
        const { username, password } = json;

        if (!username || !password) throw new Error();
        if (password == env["PASSWORD"] && username == env["USERNAME"]) {
            runBuild();
            ctx.response.status = 200;
            return;
        }
        else {
            ctx.response.status = 403;
            return;
        }

    } catch (_) {
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