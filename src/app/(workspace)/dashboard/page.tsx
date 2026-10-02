import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/session";
import { dashboardFor } from "@/lib/routing";

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  redirect(dashboardFor(session?.role));
}
