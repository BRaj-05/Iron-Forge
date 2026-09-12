import { NextResponse } from "next/server";
import { updateAllSubscriptionExpiries } from "@/lib/subscriptions";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await updateAllSubscriptionExpiries());
}

export async function POST(request: Request) {
  return GET(request);
}
