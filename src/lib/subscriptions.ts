import { SubStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getSubscriptionStatus(endDate: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / DAY_MS);

  if (daysRemaining < 0) return { daysRemaining, status: SubStatus.EXPIRED };
  if (daysRemaining <= 7) return { daysRemaining, status: SubStatus.EXPIRING_SOON };
  return { daysRemaining, status: SubStatus.ACTIVE };
}

export async function updateSubscriptionExpiryForUser(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId, status: { not: SubStatus.CANCELLED } },
    orderBy: { endDate: "desc" },
  });

  for (const subscription of subscriptions) {
    const { daysRemaining, status } = getSubscriptionStatus(subscription.endDate);

    if (subscription.status !== status) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status },
      });
    }

    if (status === SubStatus.EXPIRING_SOON) {
      await prisma.notification.upsert({
        where: { id: `${subscription.id.slice(0, 12)}${userId.slice(0, 12)}` },
        update: {},
        create: {
          id: `${subscription.id.slice(0, 12)}${userId.slice(0, 12)}`,
          userId,
          type: "SUBSCRIPTION_EXPIRING",
          message: `Your membership expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`,
        },
      });
    }
  }

  return subscriptions.length;
}

export async function updateAllSubscriptionExpiries() {
  const subscriptions = await prisma.subscription.findMany({
    where: { status: { not: SubStatus.CANCELLED } },
  });

  let changed = 0;

  for (const subscription of subscriptions) {
    const { daysRemaining, status } = getSubscriptionStatus(subscription.endDate);
    if (subscription.status !== status) {
      changed += 1;
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status },
      });
    }

    if (status === SubStatus.EXPIRING_SOON) {
      const existing = await prisma.notification.findFirst({
        where: {
          userId: subscription.userId,
          type: "SUBSCRIPTION_EXPIRING",
          message: { contains: subscription.id },
        },
      });

      if (!existing) {
        await prisma.notification.create({
          data: {
            userId: subscription.userId,
            type: "SUBSCRIPTION_EXPIRING",
            message: `Membership ${subscription.id} expires in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`,
          },
        });
      }
    }
  }

  return { checked: subscriptions.length, changed };
}

export async function getUserWithSubscription(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { endDate: "desc" },
  });

  const plan = subscription
    ? await prisma.membershipPlan.findUnique({ where: { id: subscription.planId } })
    : null;

  return { user, subscription, plan };
}
