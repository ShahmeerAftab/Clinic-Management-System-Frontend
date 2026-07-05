/**
 * lib/hooks/useHealthRecords.ts
 * TanStack Query hooks for health records.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/client/api";
import type { HealthRecord } from "@/types";

/** Get health records (patient sees own, doctor/admin sees all) */
export function useHealthRecords() {
  return useQuery({
    queryKey: ["health-records"],
    queryFn: api.getHealthRecords,
  });
}

/** Create a new health record (doctor only) */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<HealthRecord>) => api.createHealthRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
  });
}

/** Delete a health record (doctor/admin only) */
export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
    },
  });
}
