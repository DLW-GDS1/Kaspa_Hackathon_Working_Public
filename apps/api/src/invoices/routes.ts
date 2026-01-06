import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createInvoice, getInvoice, listInvoices } from "./service.js";
import { normalizeNetworkKey } from "../networks.js";

const CreateInvoiceSchema = z.object({
  amountKAS: z.string().regex(/^\d+(\.\d{1,8})?$/, "amountKAS must be decimal with up to 8 decimals"),
  memo: z.string().max(200).optional(),
  expiresInMinutes: z.number().int().positive().max(60 * 24 * 7).optional(),
});

export async function invoicesRoutes(app: FastifyInstance) {
  app.get("/invoices", async (req) => {
    const network = normalizeNetworkKey(req.headers["x-kpay-network"] as string | undefined);
    return listInvoices(network);
  });

  app.get("/invoices/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const invoice = await getInvoice(id);
    if (!invoice) return reply.code(404).send({ error: "NOT_FOUND" });
    return invoice;
  });

  app.post("/invoices", async (req, reply) => {
    const parsed = CreateInvoiceSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    const network = normalizeNetworkKey(req.headers["x-kpay-network"] as string | undefined);
    const invoice = await createInvoice({ network, ...parsed.data });
    return reply.code(201).send(invoice);
  });
}
