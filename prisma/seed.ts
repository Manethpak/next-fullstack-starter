import { PrismaClient } from "@/generated/client";
import { auth } from "@/server/core/auth";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

async function main() {
  // create a default user
  const now = new Date();
  const email = "user@email.com";
  const password = await (await auth.$context).password.hash("Password123");

  await prisma.account.create({
    data: {
      id: "account1",
      accountId: "user1",
      providerId: "credential",
      createdAt: now,
      updatedAt: now,
      password,
      user: {
        create: {
          id: "user1",
          name: "default user",
          email,
          emailVerified: true,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
  });
}

main()
  .then(() => {
    console.log("Seeded default user completed 🌱");
    console.log("Email: user@email.com, Password: Password123");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
