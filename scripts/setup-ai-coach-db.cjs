// Run only after approving the target database. Does not synchronize other models.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.$runCommandRaw({
    createIndexes: "AIWorkoutSession",
    indexes: [
      {
        key: { customerId: 1, clientSessionId: 1 },
        name: "AIWorkoutSession_customerId_clientSessionId_key",
        unique: true,
      },
      {
        key: { customerId: 1, createdAt: 1 },
        name: "AIWorkoutSession_customerId_createdAt_idx",
      },
    ],
  });
  console.log(
    "AIWorkoutSession indexes are ready. No other collections were changed.",
  );
}
main()
  .catch(() => {
    console.error(
      "Could not create AIWorkoutSession indexes. Check connectivity, database permissions and duplicate session IDs.",
    );
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
