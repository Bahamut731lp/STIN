import app from "./server.ts"
import log from "./lib/logger.ts"

log.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });