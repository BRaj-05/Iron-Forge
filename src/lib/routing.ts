/** Shared, browser-safe role and destination policy. */
export const APP_ROLES = ["CUSTOMER", "TRAINER", "OWNER"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export function normalizeRole(role?: string): AppRole | undefined {
  if (role === "ADMIN") return "OWNER";
  return APP_ROLES.find((item) => item === role);
}

export function dashboardFor(role?: string) {
  switch (normalizeRole(role)) {
    case "OWNER": return "/admin";
    case "TRAINER": return "/trainer";
    case "CUSTOMER": return "/customer";
    default: return "/login";
  }
}

/** Destination shown immediately after a successful login. */
export function loginLandingFor(role?: string) {
  return normalizeRole(role) === "CUSTOMER" ? "/" : dashboardFor(role);
}

/** Only allow same-site destinations inside the user's own workspace. */
export function loginDestination(role: string, next: string | null) {
  const home = dashboardFor(role);
  const root = home;
  if (!next || next.includes("\\") || next.startsWith("//")) return loginLandingFor(role);
  const pathname = next.split(/[?#]/)[0];
  if (pathname.split("/").some((part) => part === "." || part === ".." || /%/i.test(part))) return home;
  return pathname === root || pathname.startsWith(`${root}/`) ? next : home;
}
