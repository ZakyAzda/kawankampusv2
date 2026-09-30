import { PrismaClient } from "@prisma/client";
import { seedForEmail } from "./seed-user";

const prisma = new PrismaClient();

async function main() {
  const targetEmail = process.argv[2] || "dimas@ui.ac.id";
  await seedForEmail(targetEmail);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
