"use client";
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/modules/customer/api";
import type { CustomerDashboardData } from "@/modules/customer/types";
import { apiRoutes } from "@/config/api-routes";

export function useCustomerDashboard() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setError("");
    try { setData(await apiRequest<CustomerDashboardData>(apiRoutes.customer.dashboard)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load your dashboard."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, setError, refresh };
}
