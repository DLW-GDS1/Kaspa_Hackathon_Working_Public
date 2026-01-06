import Fastify from "fastify";
import cors from "fastify-cors";
import { env } from "./env.js";
import { prisma } from "./prisma.js";
import { invoicesRoutes } from "./invoices/routes.js";
import { statusRoutes } from "./status/routes.js";
import { startPoller } from "./worker/poller.js";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.get("/health", async () => ({ ok: true }));

await prisma.$connect();
await app.register(invoicesRoutes);
await app.register(statusRoutes);

app.listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => app.log.info(`API listening on :${env.PORT}`))
  .catch((err) => { app.log.error(err); process.exit(1); });

startPoller();
