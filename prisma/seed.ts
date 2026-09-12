import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, SubStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_SEED_EMAIL || "owner@gym.com";
  const ownerPassword = process.env.OWNER_SEED_PASSWORD || "owner12345";
  const trainerEmail = "trainer@gym.com";
  const customerEmail = "customer@gym.com";

  const [ownerHash, trainerHash, customerHash] = await Promise.all([
    bcrypt.hash(ownerPassword, 10),
    bcrypt.hash("trainer12345", 10),
    bcrypt.hash("customer12345", 10),
  ]);

  await prisma.user.upsert({
    where: { email: ownerEmail.toLowerCase() },
    update: { passwordHash: ownerHash, role: Role.OWNER, isActive: true },
    create: {
      name: "Iron Forge Owner",
      email: ownerEmail.toLowerCase(),
      passwordHash: ownerHash,
      role: Role.OWNER,
      assignedCustomerIds: [],
    },
  });

  const planInputs = [
    { name: "Monthly Forge", durationDays: 30, price: 49, features: ["Gym access", "Attendance tracking"] },
    { name: "Quarterly Strength", durationDays: 90, price: 129, features: ["Gym access", "Trainer review", "Progress dashboard"] },
    { name: "Annual Elite", durationDays: 365, price: 449, features: ["Full access", "Priority trainer slots", "Payment history"] },
  ];

  const plans = [];
  for (const plan of planInputs) {
    const existing = await prisma.membershipPlan.findFirst({ where: { name: plan.name } });
    plans.push(
      existing
        ? await prisma.membershipPlan.update({ where: { id: existing.id }, data: plan })
        : await prisma.membershipPlan.create({ data: plan }),
    );
  }

  const trainer = await prisma.user.upsert({
    where: { email: trainerEmail },
    update: { passwordHash: trainerHash, role: Role.TRAINER, isActive: true },
    create: {
      name: "Maya Strength",
      email: trainerEmail,
      passwordHash: trainerHash,
      role: Role.TRAINER,
      specialization: "Strength and mobility",
      experienceYrs: 6,
      assignedCustomerIds: [],
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      isActive: true,
      assignedTrainerId: trainer.id,
    },
    create: {
      name: "Alex Member",
      email: customerEmail,
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      assignedTrainerId: trainer.id,
      assignedCustomerIds: [],
    },
  });

  await prisma.user.update({
    where: { id: trainer.id },
    data: { assignedCustomerIds: [customer.id] },
  });

  const activePlan = plans[0];
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + activePlan.durationDays);

  await prisma.subscription.create({
    data: {
      userId: customer.id,
      planId: activePlan.id,
      startDate,
      endDate,
      status: SubStatus.ACTIVE,
    },
  });

  await prisma.payment.create({
    data: {
      userId: customer.id,
      amount: activePlan.price,
      method: "Seed cash",
      status: "PAID",
    },
  });

  console.log(`Seeded owner ${ownerEmail}, trainer ${trainerEmail}, customer ${customerEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
