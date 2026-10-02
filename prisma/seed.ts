import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, SubStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_SEED_EMAIL || "owner@gym.com";
  const ownerPassword = process.env.OWNER_SEED_PASSWORD || "owner12345";
  const trainerEmail = "trainer@gym.com";
  const customerEmail = "customer@gym.com";
  const demoMembers = [
    { name: "Alex Member", email: customerEmail, days: 7, weightKg: 72, heightCm: 175 },
    { name: "Riya Sharma", email: "riya@gym.com", days: 5, weightKg: 63, heightCm: 164 },
    { name: "Kabir Khan", email: "kabir@gym.com", days: 4, weightKg: 81, heightCm: 178 },
    { name: "Neha Patel", email: "neha@gym.com", days: 3, weightKg: 58, heightCm: 160 },
    { name: "Arjun Mehta", email: "arjun@gym.com", days: 2, weightKg: 86, heightCm: 181 },
  ];

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

  const customers = [];
  for (const member of demoMembers) {
    customers.push(
      await prisma.user.upsert({
        where: { email: member.email },
        update: {
          name: member.name,
          passwordHash: customerHash,
          role: Role.CUSTOMER,
          isActive: true,
          assignedTrainerId: trainer.id,
          heightCm: member.heightCm,
          weightKg: member.weightKg,
        },
        create: {
          name: member.name,
          email: member.email,
          passwordHash: customerHash,
          role: Role.CUSTOMER,
          assignedTrainerId: trainer.id,
          assignedCustomerIds: [],
          heightCm: member.heightCm,
          weightKg: member.weightKg,
        },
      }),
    );
  }

  await prisma.user.update({
    where: { id: trainer.id },
    data: { assignedCustomerIds: customers.map((customer) => customer.id) },
  });

  const activePlan = plans[0];
  for (const [index, customer] of customers.entries()) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + activePlan.durationDays);

    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: customer.id, planId: activePlan.id, status: SubStatus.ACTIVE },
    });
    if (!existingSubscription) {
      await prisma.subscription.create({
        data: {
          userId: customer.id,
          planId: activePlan.id,
          startDate,
          endDate,
          status: SubStatus.ACTIVE,
        },
      });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { userId: customer.id, method: "Seed cash" },
    });
    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          userId: customer.id,
          amount: activePlan.price,
          method: "Seed cash",
          status: "PAID",
        },
      });
    }

    const activeDays = demoMembers[index].days;
    for (let offset = 0; offset < activeDays; offset += 1) {
      const date = new Date();
      date.setHours(9 + index, 0, 0, 0);
      date.setDate(date.getDate() - offset);
      const logDate = date.toISOString().slice(0, 10);

      await prisma.attendance.upsert({
        where: { customerId_logDate: { customerId: customer.id, logDate } },
        update: { checkIn: date, trainerId: trainer.id },
        create: { customerId: customer.id, trainerId: trainer.id, logDate, checkIn: date },
      });
      if (offset % 2 === 0 || index < 2) {
        await prisma.dailyWorkoutLog.upsert({
          where: { customerId_logDate: { customerId: customer.id, logDate } },
          update: { completed: true, trainerId: trainer.id },
          create: {
            customerId: customer.id,
            trainerId: trainer.id,
            logDate,
            workoutName: "Seed strength session",
            exercises: [{ name: "Bench Press", sets: 3, reps: 10 }],
            completed: true,
          },
        });
      }
      if (offset % 3 !== 1) {
        await prisma.dailyDietLog.upsert({
          where: { customerId_logDate: { customerId: customer.id, logDate } },
          update: { completed: true, waterCups: 6 + index },
          create: {
            customerId: customer.id,
            logDate,
            meals: { breakfast: "Oats", lunch: "Dal rice", dinner: "Paneer roti" },
            waterCups: 6 + index,
            completed: true,
          },
        });
      }
      await prisma.bodyMetricLog.upsert({
        where: { customerId_logDate: { customerId: customer.id, logDate } },
        update: { weightKg: demoMembers[index].weightKg - offset * 0.15, heightCm: demoMembers[index].heightCm },
        create: {
          customerId: customer.id,
          logDate,
          weightKg: demoMembers[index].weightKg - offset * 0.15,
          heightCm: demoMembers[index].heightCm,
        },
      });
    }
  }

  console.log(`Seeded owner ${ownerEmail}, trainer ${trainerEmail}, ${customers.length} customers`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
