/**
 * lib/hooks/useStats.ts
 * TanStack Query hooks for dashboard statistics.
 */

import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/client/api";

/** Fetch system-wide dashboard stats (total patients, appointments, etc.) */
export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: api.getDashboardStats,
    staleTime: 30 * 1000, // re-fetch after 30 seconds
  });
}

/** Fetch the patient's own dashboard summary */
export function usePatientDashboard() {
  return useQuery({
    queryKey: ["patient-dashboard"],
    queryFn: api.getPatientDashboard,
  });
}
