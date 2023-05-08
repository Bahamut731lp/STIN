import app from "./server.ts"
import log from "./lib/logger.ts"
import { Cron } from "https://deno.land/x/croner@6.0.3/dist/croner.js";
import updateRates from "./database/updateRates.ts";

const rateJob = new Cron("40 14-16 * * 1-5", updateRates);
//Prvotní spuštění úlohy pro hledání nového kurzu
rateJob.trigger();

log.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });