import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.invoice.count();
  if (count > 0) return;

  await prisma.invoice.create({
    data: {
      network: "TESTNET_TN10",
      amountKAS: "1.50000000",
      memo: "Demo invoice (seed)",
      address: "kaspatest:demo_seed_address_0001",
    },
  });
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
