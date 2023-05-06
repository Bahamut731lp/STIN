import app from "./server.ts"

console.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });