/**
 * lib/hooks/useDoctors.ts
 * TanStack Query hook to fetch the list of doctors (for dropdowns).
 */

import { useQuery } from "@tanstack/react-query";
import * as api from "@/frontend/lib/client/api";

/** Get all users with role=doctor (used in booking/appointment forms) */
export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: api.getDoctors,
    staleTime: 5 * 60 * 1000, // doctors list rarely changes — cache for 5 minutes
  });
}
