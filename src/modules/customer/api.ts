export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Something went wrong. Please try again.");
  return payload as T;
}

export function jsonRequest<T>(url: string, method: "POST" | "PATCH", body: unknown) {
  return apiRequest<T>(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
