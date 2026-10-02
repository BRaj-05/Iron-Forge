import { redirect } from "next/navigation";

/** Backward-compatible route for old bookmarks. */
export default function LegacyCustomerDashboardPage() {
  redirect("/customer");
}
